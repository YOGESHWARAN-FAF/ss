import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchChannelData, updateChannelField, updateChannelFields } from '../utils/api';

/**
 * Custom hook to manage ThingSpeak channel state.
 * @param {string} channelId 
 * @param {string} readKey 
 * @param {string} writeKey 
 */
export const useThingSpeak = (channelId, readKey, writeKey) => {
    // State for fields 1-8. Initialize with null (unknown) or 0.
    const [data, setData] = useState({
        field1: '0', field2: '0', field3: '0', field4: '0',
        field5: '0', field6: '0', field7: '0', field8: '0'
    });
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Track pending updates to prevent server overwrite
    // Map: fieldKey -> timestamp (Date.now())
    const pendingUpdatesRef = useRef({});

    // Desired State for Batching updates (debouncing)
    // Map: fieldKey -> value (0 or 1)
    const desiredStateRef = useRef({});
    const batchTimerRef = useRef(null);

    // Check pending locks
    const checkPendingLocks = (result, prev) => {
        const newData = { ...prev, ...result };
        const now = Date.now();

        // Post-process logic: Check pending locks
        Object.keys(pendingUpdatesRef.current).forEach(fieldKey => {
            const lockTime = pendingUpdatesRef.current[fieldKey];
            // If lock is extremely old (> 60s), remove it (safety valve)
            if (now - lockTime > 60000) {
                delete pendingUpdatesRef.current[fieldKey];
                return;
            }

            const serverValue = result[fieldKey];
            const localValue = prev[fieldKey];

            // If server value matches local value, synced! Remove lock.
            if (serverValue == localValue) {
                delete pendingUpdatesRef.current[fieldKey];
            } else {
                // Server is different (likely old or race condition). Keep local value.
                newData[fieldKey] = localValue;
            }
        });
        return newData;
    };

    // Fetch data function
    const fetchData = useCallback(async () => {
        const result = await fetchChannelData(channelId, readKey);

        if (result) {
            setData(prev => checkPendingLocks(result, prev));
            setLastUpdated(result.created_at);
        }
        setLoading(false);
    }, [channelId, readKey]);

    // Initial fetch and polling
    useEffect(() => {
        fetchData(); // Initial load
        const interval = setInterval(fetchData, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [fetchData]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (batchTimerRef.current) clearTimeout(batchTimerRef.current);
        };
    }, []);

    // We need a ref to access latest 'data' inside setTimeout closure
    const latestDataRef = useRef(data);
    useEffect(() => { latestDataRef.current = data; }, [data]);

    // Handle Toggle with Batching
    const toggleField = async (fieldIndex) => {
        const fieldKey = `field${fieldIndex}`;
        const currentValue = latestDataRef.current[fieldKey]; // Use ref for current
        const isCurrentlyOn = currentValue === '1' || currentValue === 1;
        const newValue = isCurrentlyOn ? '0' : '1';

        // 1. Optimistic Update (Immediate UI feedback)
        setData(prev => ({ ...prev, [fieldKey]: newValue }));

        // 2. Set Lock & Update Desired State
        pendingUpdatesRef.current[fieldKey] = Date.now();
        desiredStateRef.current[fieldKey] = newValue;

        // 3. Debounce the API Call
        if (batchTimerRef.current) {
            clearTimeout(batchTimerRef.current);
        }

        // Wait 1.5s then send BATCH update
        batchTimerRef.current = setTimeout(async () => {
            // Prepare payload: All 8 fields MUST be sent to preserve state
            const payload = {};
            const baseData = latestDataRef.current;

            for (let i = 1; i <= 8; i++) {
                const k = `field${i}`;
                // Priority: Desired Change > Existing Data
                if (desiredStateRef.current[k] !== undefined) {
                    payload[k] = desiredStateRef.current[k];
                } else {
                    payload[k] = baseData[k];
                }
            }

            // Clear batch buffer
            desiredStateRef.current = {};

            try {
                // Send Batch Update
                await updateChannelFields(writeKey, payload);
            } catch (err) {
                console.error("Batch update failed", err);
            }
        }, 1500);
    };

    return { data, loading, lastUpdated, toggleField };
};

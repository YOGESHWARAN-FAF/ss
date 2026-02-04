/**
 * ThingSpeak API Helper
 * Handles reading from and writing to ThingSpeak channels.
 */

const BASE_URL = 'https://api.thingspeak.com';

/**
 * Fetch the last known values from the channel.
 * @param {string} channelId 
 * @param {string} readKey 
 * @returns {Promise<object>} The feed data.
 */
export const fetchChannelData = async (channelId, readKey) => {
    try {
        const response = await fetch(`${BASE_URL}/channels/${channelId}/feeds/last.json?api_key=${readKey}`);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch channel data:", error);
        return null;
    }
};

/**
 * Update a specific field in the channel.
 * @param {string} writeKey 
 * @param {number} fieldIndex (1-8)
 * @param {number} value (0 or 1)
 * @returns {Promise<boolean>} Success status
 */
/**
 * Update one or more fields in the channel.
 * @param {string} writeKey 
 * @param {object} fields - Object like { field1: 1, field2: 0 }
 * @returns {Promise<boolean>} Success status
 */
export const updateChannelFields = async (writeKey, fields) => {
    try {
        const queryParams = new URLSearchParams(fields);
        queryParams.append('api_key', writeKey);

        const response = await fetch(`${BASE_URL}/update?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error(`Error updating data: ${response.statusText}`);
        }

        const result = await response.text();
        return parseInt(result) > 0;
    } catch (error) {
        console.error("Failed to update channel fields:", error);
        return false;
    }
};

/**
 * Legacy wrapper for single field update
 */
export const updateChannelField = async (writeKey, fieldIndex, value) => {
    return updateChannelFields(writeKey, { [`field${fieldIndex}`]: value });
};

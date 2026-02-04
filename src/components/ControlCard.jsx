import React from 'react';
import ToggleSwitch from './ToggleSwitch';
import { useThingSpeak } from '../hooks/useThingSpeak';

const ControlCard = ({ title, channelId, readKey, writeKey }) => {
    const { data, loading, toggleField } = useThingSpeak(channelId, readKey, writeKey);

    const fans = [1, 2, 3, 4];
    const lights = [5, 6, 7, 8];

    const getStatusColor = (val) => (val === '1' || val === 1) ? 'active' : 'inactive';

    if (loading) return <div className="card loading">Loading {title}...</div>;

    return (
        <div className="control-card glass-panel">
            <h2 className="card-title">{title}</h2>

            <div className="control-section">
                <h3>Fans</h3>
                <div className="grid-responsive">
                    {fans.map(num => (
                        <div key={`fan-${num}`} className={`control-item fan ${getStatusColor(data[`field${num}`])}`}>
                            <ToggleSwitch
                                label={`Fan ${num}`}
                                isOn={data[`field${num}`] === '1' || data[`field${num}`] === 1}
                                onToggle={() => toggleField(num)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="control-section">
                <h3>Lights</h3>
                <div className="grid-responsive">
                    {lights.map(num => (
                        <div key={`light-${num}`} className={`control-item light ${getStatusColor(data[`field${num}`])}`}>
                            <ToggleSwitch
                                label={`Light ${num - 4}`}
                                isOn={data[`field${num}`] === '1' || data[`field${num}`] === 1}
                                onToggle={() => toggleField(num)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ControlCard;

import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose, channelConfig, onSave }) => {
    const [config, setConfig] = useState(channelConfig);

    useEffect(() => {
        if (isOpen) {
            setConfig(channelConfig);
        }
    }, [isOpen, channelConfig]);

    const handleChange = (index, field, value) => {
        const newSets = [...config];
        newSets[index] = { ...newSets[index], [field]: value };
        setConfig(newSets);
    };

    const handleSave = () => {
        onSave(config);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content glass-panel-modal">
                <div className="modal-header">
                    <h2>Configuration</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {config.map((set, index) => (
                        <div key={index} className="config-group">
                            <h3 className="section-title">Block {index + 1} Settings</h3>
                            <div className="input-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={set.title}
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label>Channel ID</label>
                                <input
                                    type="text"
                                    value={set.channelId}
                                    onChange={(e) => handleChange(index, 'channelId', e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label>Read API Key</label>
                                <input
                                    type="text"
                                    value={set.readKey}
                                    onChange={(e) => handleChange(index, 'readKey', e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label>Write API Key</label>
                                <input
                                    type="text"
                                    value={set.writeKey}
                                    onChange={(e) => handleChange(index, 'writeKey', e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-save" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;

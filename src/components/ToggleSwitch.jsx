import React from 'react';
import './ToggleSwitch.css'; // We will define this css in index.css generally or here

const ToggleSwitch = ({ isOn, onToggle, label, disabled }) => {
    return (
        <div className={`toggle-container ${disabled ? 'disabled' : ''}`}>
            <span className="toggle-label">{label}</span>
            <div
                className={`toggle-switch ${isOn ? 'on' : 'off'}`}
                onClick={!disabled ? onToggle : undefined}
            >
                <div className="toggle-handle" />
            </div>
        </div>
    );
};

export default ToggleSwitch;

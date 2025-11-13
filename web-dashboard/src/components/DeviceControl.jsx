import React from 'react';
import './DeviceControl.css';

const DeviceControl = ({ relayState, onRelayToggle, onBuzzer }) => {
  return (
    <div className="device-control">
      <h3>Device Controls</h3>
      
      <div className="control-item">
        <div className="control-header">
          <span className="control-label">Relay (Fan/Light)</span>
          <div className={`toggle-switch ${relayState ? 'active' : ''}`}>
            <input
              type="checkbox"
              checked={relayState}
              onChange={(e) => onRelayToggle(e.target.checked)}
              id="relay-toggle"
            />
            <label htmlFor="relay-toggle"></label>
          </div>
        </div>
        <div className="control-status">
          Status: <span className={relayState ? 'status-on' : 'status-off'}>
            {relayState ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      <div className="control-item">
        <div className="control-header">
          <span className="control-label">Buzzer</span>
        </div>
        <button
          className="buzzer-button"
          onClick={onBuzzer}
          onMouseDown={(e) => e.target.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.target.style.transform = 'scale(1)'}
        >
          🔊 Beep
        </button>
      </div>

      <div className="control-info">
        <p>💡 Toggle the relay to control connected devices (fan, lights, etc.)</p>
        <p>🔊 Click the buzzer button to test audio feedback</p>
      </div>
    </div>
  );
};

export default DeviceControl;


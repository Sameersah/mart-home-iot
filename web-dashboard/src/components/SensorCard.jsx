import React from 'react';
import './SensorCard.css';

const SensorCard = ({ label, value, unit, icon, color, status }) => {
  const statusColor = color || '#667EEA';

  return (
    <div className="sensor-card" style={{ borderTopColor: statusColor }}>
      <div className="sensor-icon-wrapper">
        <div className="sensor-icon" style={{ color: statusColor }}>
          {icon}
        </div>
      </div>
      <div className="sensor-content">
        <h3 className="sensor-label">{label}</h3>
        <div className="sensor-value">
          <span className="value-number">{Math.round(value)}</span>
          <span className="value-unit">{unit}</span>
        </div>
        {status && (
          <div className="sensor-status" style={{ color: statusColor }}>
            {status}
          </div>
        )}
      </div>
      <div className="sensor-indicator" style={{ backgroundColor: statusColor }}></div>
    </div>
  );
};

export default SensorCard;


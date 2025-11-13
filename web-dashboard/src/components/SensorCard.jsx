import React from 'react';
import './SensorCard.css';

const SensorCard = ({ label, value, unit, icon, color }) => {
  // Determine status color based on value
  const getStatusColor = () => {
    if (label === 'Temperature') {
      if (value < 15) return '#4A90E2'; // Blue (cold)
      if (value > 30) return '#E74C3C'; // Red (hot)
      return '#27AE60'; // Green (normal)
    }
    if (label === 'Humidity') {
      if (value < 30) return '#E67E22'; // Orange (dry)
      if (value > 70) return '#3498DB'; // Blue (humid)
      return '#27AE60'; // Green (normal)
    }
    return color || '#667EEA';
  };

  return (
    <div className="sensor-card" style={{ borderTopColor: getStatusColor() }}>
      <div className="sensor-icon">{icon}</div>
      <div className="sensor-content">
        <h3 className="sensor-label">{label}</h3>
        <div className="sensor-value">
          <span className="value-number">{value.toFixed(1)}</span>
          <span className="value-unit">{unit}</span>
        </div>
      </div>
      <div className="sensor-indicator" style={{ backgroundColor: getStatusColor() }}></div>
    </div>
  );
};

export default SensorCard;


import React from 'react';
import './StatisticsCard.css';

const StatisticsCard = ({ title, value, unit = '', icon, color, trend = null }) => {
  return (
    <div className="statistics-card" style={{ borderTopColor: color }}>
      <div className="statistics-header">
        <div className="statistics-icon" style={{ color: color }}>
          {icon}
        </div>
        <div className="statistics-title">{title}</div>
      </div>
      <div className="statistics-value">
        <span className="statistics-number" style={{ color: color }}>
          {value}
        </span>
        {unit && <span className="statistics-unit">{unit}</span>}
      </div>
      {trend && (
        <div className="statistics-trend" style={{ color: trend.color }}>
          {trend.icon} {trend.text}
        </div>
      )}
    </div>
  );
};

export default StatisticsCard;


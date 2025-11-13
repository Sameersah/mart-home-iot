import React, { useState, useEffect } from 'react';
import './Gauge.css';

const Gauge = ({ label, value, min, max, unit, color }) => {
  const [animatedValue, setAnimatedValue] = useState(value || 0);
  
  // Smooth animation for real-time updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value || 0);
    }, 10);
    return () => clearTimeout(timer);
  }, [value]);
  
  const percentage = ((animatedValue - min) / (max - min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  
  // Calculate angle for gauge
  // Arc spans 180 degrees: from -180° (extreme left/0%) to 0° (extreme right/100%)
  // So angle ranges from -180 to 0 degrees (0 starts at extreme left)
  const angle = (clampedPercentage / 100) * 180 - 180;
  
  // Debug: log the values
  console.log('Gauge Debug:', { value, animatedValue, percentage: clampedPercentage, angle });

  return (
    <div className="gauge-container">
      <div className="gauge-wrapper">
        <svg className="gauge-svg" viewBox="0 0 200 120" style={{ display: 'block' }}>
          {/* Background arc - simple gray track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E0E0E0"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Needle - moves with real-time data */}
          <g transform={`rotate(${angle} 100 100)`} className="gauge-needle-group" style={{ transformOrigin: '100px 100px' }}>
            {/* Main needle line - very visible */}
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="20"
              stroke="#FF0000"
              strokeWidth="5"
              strokeLinecap="round"
              className="gauge-needle"
              style={{ stroke: '#FF0000', strokeWidth: '5' }}
            />
            {/* Needle tip/arrowhead - red for visibility */}
            <polygon
              points="100,20 92,32 108,32"
              fill="#FF0000"
              style={{ fill: '#FF0000' }}
            />
          </g>
          
          {/* Center dot - on top of needle */}
          <circle cx="100" cy="100" r="10" fill="#000000" />
          <circle cx="100" cy="100" r="6" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
};

export default Gauge;


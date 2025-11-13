import React, { useState, useEffect } from 'react';
import './Gauge.css';

const Gauge = ({ label, value, min = 0, max = 4095, unit = '', color = '#6366f1', threshold = 1800 }) => {
  const [animatedValue, setAnimatedValue] = useState(value || 0);
  
  // Smooth animation for real-time updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value || 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [value]);
  
  const percentage = ((animatedValue - min) / (max - min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));
  const thresholdPercentage = ((threshold - min) / (max - min)) * 100;
  
  // Calculate angle for gauge (semicircle: -180° to 0°)
  const angle = (clampedPercentage / 100) * 180 - 180;
  const thresholdAngle = (thresholdPercentage / 100) * 180 - 180;
  
  // Determine status color
  const statusColor = animatedValue < threshold ? '#E74C3C' : '#27AE60';
  
  return (
    <div className="gauge-container">
      <div className="gauge-label">{label}</div>
      <div className="gauge-wrapper">
        <svg className="gauge-svg" viewBox="0 0 200 120">
          {/* Background arc track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="10"
            strokeLinecap="round"
          />
          
          {/* Threshold indicator arc (red zone) */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#FEE2E2"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${thresholdPercentage * 1.6} 160`}
            opacity="0.5"
          />
          
          {/* Value arc (colored based on status) */}
          <path
            d={`M 20 100 A 80 80 0 ${clampedPercentage > 50 ? 1 : 0} 1 ${100 + 80 * Math.cos((angle + 180) * Math.PI / 180)} ${100 - 80 * Math.sin((angle + 180) * Math.PI / 180)}`}
            fill="none"
            stroke={statusColor}
            strokeWidth="10"
            strokeLinecap="round"
            className="gauge-value-arc"
          />
          
          {/* Threshold marker line */}
          <g transform={`rotate(${thresholdAngle} 100 100)`}>
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="15"
              stroke="#E74C3C"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            <text
              x="100"
              y="10"
              textAnchor="middle"
              fontSize="8"
              fill="#E74C3C"
              fontWeight="600"
            >
              Threshold
            </text>
          </g>
          
          {/* Needle */}
          <g transform={`rotate(${angle} 100 100)`} className="gauge-needle-group">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="20"
              stroke={statusColor}
              strokeWidth="4"
              strokeLinecap="round"
              className="gauge-needle"
            />
            <polygon
              points="100,20 94,30 106,30"
              fill={statusColor}
            />
          </g>
          
          {/* Center dot */}
          <circle cx="100" cy="100" r="8" fill="#1e293b" />
          <circle cx="100" cy="100" r="4" fill="#ffffff" />
          
          {/* Scale markers */}
          {[0, 25, 50, 75, 100].map((mark) => {
            const markAngle = (mark / 100) * 180 - 180;
            const x1 = 100 + 75 * Math.cos((markAngle + 180) * Math.PI / 180);
            const y1 = 100 - 75 * Math.sin((markAngle + 180) * Math.PI / 180);
            const x2 = 100 + 85 * Math.cos((markAngle + 180) * Math.PI / 180);
            const y2 = 100 - 85 * Math.sin((markAngle + 180) * Math.PI / 180);
            const value = min + (max - min) * (mark / 100);
            
            return (
              <g key={mark}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#64748b"
                  strokeWidth="1.5"
                />
                <text
                  x={x2 + (x2 > 100 ? 5 : -5)}
                  y={y2 + 3}
                  textAnchor={x2 > 100 ? 'start' : 'end'}
                  fontSize="9"
                  fill="#64748b"
                  fontWeight="500"
                >
                  {Math.round(value)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <div className="gauge-value-display">
        <span className="gauge-value-number" style={{ color: statusColor }}>
          {Math.round(animatedValue)}
        </span>
        <span className="gauge-value-unit">{unit}</span>
      </div>
      <div className="gauge-status" style={{ color: statusColor }}>
        {animatedValue < threshold ? '⚠️ Below Threshold' : '✅ Normal'}
      </div>
    </div>
  );
};

export default Gauge;

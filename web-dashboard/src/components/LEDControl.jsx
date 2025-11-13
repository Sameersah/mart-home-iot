import React from 'react';
import { SketchPicker } from 'react-color';
import './LEDControl.css';

const LEDControl = ({ color, brightness, onColorChange, onBrightnessChange }) => {
  const presetColors = [
    { name: 'Red', hex: '#FF0000' },
    { name: 'Green', hex: '#00FF00' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Purple', hex: '#800080' },
  ];

  const handlePresetClick = (presetColor) => {
    onColorChange({ hex: presetColor.hex });
  };

  return (
    <div className="led-control">
      <h3>RGB LED Control</h3>
      
      <div className="color-picker-section">
        <label>Color</label>
        <div className="color-preview" style={{ backgroundColor: color }}>
          <span>{color}</span>
        </div>
        <SketchPicker
          color={color}
          onChange={onColorChange}
          disableAlpha
          width="100%"
        />
      </div>

      <div className="preset-colors">
        <label>Preset Colors</label>
        <div className="preset-grid">
          {presetColors.map((preset) => (
            <button
              key={preset.hex}
              className="preset-color-btn"
              style={{ backgroundColor: preset.hex }}
              onClick={() => handlePresetClick(preset)}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      <div className="brightness-control">
        <label>
          Brightness: {brightness}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={brightness}
          onChange={(e) => onBrightnessChange(parseInt(e.target.value))}
          className="brightness-slider"
        />
        <div className="brightness-indicator">
          <div
            className="brightness-fill"
            style={{ width: `${brightness}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LEDControl;


import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, onValue, set } from 'firebase/database';
import SensorCard from './components/SensorCard';
import Chart from './components/Chart';
import LEDControl from './components/LEDControl';
import DeviceControl from './components/DeviceControl';
import './App.css';

function App() {
  const [sensors, setSensors] = useState({
    light: 0
  });
  
  const [chartData, setChartData] = useState([]);
  const [ledColor, setLedColor] = useState('#FF0000');
  const [ledBrightness, setLedBrightness] = useState(100);
  const [relayState, setRelayState] = useState(false);

  // Listen to real-time sensor data
  useEffect(() => {
    const sensorsRef = ref(database, 'sensors');
    
    const unsubscribe = onValue(sensorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensors({
          light: data.light || 0
        });
        
        // Update chart data
        const timestamp = new Date().toLocaleTimeString();
        setChartData(prev => {
          const newData = [...prev, {
            time: timestamp,
            light: data.light || 0
          }];
          // Keep only last 20 data points
          return newData.slice(-20);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle LED color change
  const handleLEDColorChange = (color) => {
    setLedColor(color.hex);
    set(ref(database, 'controls/led_color'), color.hex);
  };

  // Handle LED brightness change
  const handleLEDBrightnessChange = (brightness) => {
    setLedBrightness(brightness);
    set(ref(database, 'controls/led_brightness'), brightness);
  };

  // Handle relay toggle
  const handleRelayToggle = (state) => {
    setRelayState(state);
    set(ref(database, 'controls/relay_state'), state);
  };

  // Handle buzzer
  const handleBuzzer = () => {
    set(ref(database, 'controls/buzzer'), true);
    setTimeout(() => {
      set(ref(database, 'controls/buzzer'), false);
    }, 100);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🏠 IoT Smart Home Control</h1>
        <p>Real-time monitoring and control</p>
      </header>

      <main className="dashboard">
        {/* Sensor Cards */}
        <div className="sensor-grid">
          <SensorCard
            label="Light Level"
            value={sensors.light}
            unit=""
            icon="💡"
            color="#FFE66D"
          />
        </div>

        {/* Charts */}
        <div className="chart-container">
          <Chart data={chartData} />
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          <h2>Device Controls</h2>
          <div className="controls-grid">
            <LEDControl
              color={ledColor}
              brightness={ledBrightness}
              onColorChange={handleLEDColorChange}
              onBrightnessChange={handleLEDBrightnessChange}
            />
            <DeviceControl
              relayState={relayState}
              onRelayToggle={handleRelayToggle}
              onBuzzer={handleBuzzer}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;


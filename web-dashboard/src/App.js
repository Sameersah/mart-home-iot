import React, { useState, useEffect } from 'react';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';
import SensorCard from './components/SensorCard';
import Chart from './components/Chart';
import './App.css';

function App() {
  const [sensors, setSensors] = useState({
    light: 0
  });
  
  const [chartData, setChartData] = useState([]);

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
          // Keep only last 30 data points for better visualization
          return newData.slice(-30);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Get light status based on value
  const getLightStatus = (value) => {
    if (value < 500) return { text: 'Very Dark', color: '#2C3E50' };
    if (value < 1000) return { text: 'Dark', color: '#34495E' };
    if (value < 2000) return { text: 'Moderate', color: '#F39C12' };
    if (value < 3000) return { text: 'Bright', color: '#F1C40F' };
    return { text: 'Very Bright', color: '#FFE66D' };
  };

  const lightStatus = getLightStatus(sensors.light);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <div className="header-icon">💡</div>
          <div>
            <h1>Light Intensity Monitoring System</h1>
            <p>Food & Beverage Optical Inspection - Real-time illumination monitoring</p>
          </div>
        </div>
      </header>

      <main className="dashboard">
        {/* Sensor Card */}
        <div className="sensor-section">
          <SensorCard
            label="Light Level"
            value={sensors.light}
            unit=""
            icon="💡"
            color={lightStatus.color}
            status={lightStatus.text}
          />
        </div>

        {/* Chart */}
        <div className="chart-section">
          <div className="section-header">
            <h2>Light Level Trends</h2>
            <span className="status-badge" style={{ backgroundColor: lightStatus.color }}>
              {lightStatus.text}
            </span>
          </div>
          <div className="chart-container">
            <Chart data={chartData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;


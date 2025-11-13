import React, { useState, useEffect, useMemo } from 'react';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';
import SensorCard from './components/SensorCard';
import Chart from './components/Chart';
import BarChart from './components/BarChart';
import StatisticsCard from './components/StatisticsCard';
import './App.css';

function App() {
  const [sensors, setSensors] = useState({
    light: 0
  });
  
  const [chartData, setChartData] = useState([]);
  const THRESHOLD = 1800;

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
          // Keep last 50 data points for better visualization
          return newData.slice(-50);
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Calculate statistics from chart data
  const statistics = useMemo(() => {
    if (chartData.length === 0) {
      return { min: 0, max: 0, avg: 0, current: sensors.light };
    }
    const values = chartData.map(d => d.light);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      current: sensors.light
    };
  }, [chartData, sensors.light]);

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

        {/* Statistics Cards */}
        <div className="statistics-section">
          <StatisticsCard
            title="Current"
            value={statistics.current}
            icon="📊"
            color="#6366f1"
          />
          <StatisticsCard
            title="Average"
            value={statistics.avg}
            icon="📈"
            color="#8b5cf6"
          />
          <StatisticsCard
            title="Minimum"
            value={statistics.min}
            icon="📉"
            color="#ec4899"
          />
          <StatisticsCard
            title="Maximum"
            value={statistics.max}
            icon="📊"
            color="#10b981"
          />
        </div>

        {/* Main Trend Chart with Threshold */}
        <div className="chart-section">
          <div className="section-header">
            <h2>Light Level Trends</h2>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <span className="status-badge" style={{ backgroundColor: lightStatus.color }}>
                {lightStatus.text}
              </span>
              <span className="threshold-indicator">
                Threshold: {THRESHOLD}
              </span>
            </div>
          </div>
          <div className="chart-container">
            <Chart data={chartData} threshold={THRESHOLD} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="chart-section">
          <div className="section-header">
            <h2>Recent Readings Distribution</h2>
            <span className="status-badge" style={{ backgroundColor: '#6366f1' }}>
              Last 10 Readings
            </span>
          </div>
          <div className="chart-container">
            <BarChart data={chartData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;


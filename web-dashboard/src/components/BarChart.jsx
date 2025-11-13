import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './BarChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data }) => {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="bar-chart-container">
        <div className="bar-chart-empty">No data available yet</div>
      </div>
    );
  }

  // Calculate statistics from data
  const values = data.map(d => d.light);
  const min = values.length > 0 ? Math.min(...values) : 0;
  const max = values.length > 0 ? Math.max(...values) : 0;
  const avg = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
  
  // Group data into time periods (last 10 data points for bar chart)
  const recentData = data.slice(-10);
  
  const chartData = {
    labels: recentData.map((d, i) => `T${i + 1}`),
    datasets: [
      {
        label: 'Light Level',
        data: recentData.map(d => d.light),
        backgroundColor: recentData.map(d => 
          d.light < 1800 ? 'rgba(231, 76, 60, 0.7)' : 'rgba(99, 102, 241, 0.7)'
        ),
        borderColor: recentData.map(d => 
          d.light < 1800 ? '#E74C3C' : '#6366f1'
        ),
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        padding: 12,
        titleFont: {
          size: 13,
          weight: '600',
        },
        bodyFont: {
          size: 13,
          weight: '500',
        },
        titleColor: '#f1f5f9',
        bodyColor: '#ffffff',
        borderColor: '#6366f1',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            const status = value < 1800 ? '⚠️ Below Threshold' : '✅ Normal';
            return [`Light: ${value}`, status];
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 4095,
        grid: {
          color: 'rgba(226, 232, 240, 0.8)',
          lineWidth: 1,
        },
        ticks: {
          font: {
            size: 11,
            weight: '500',
          },
          color: '#64748b',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            weight: '500',
          },
          color: '#64748b',
        },
      },
    },
    animation: {
      duration: 750,
    },
  };

  return (
    <div className="bar-chart-container">
      <div className="bar-chart-stats">
        <div className="stat-item">
          <div className="stat-label">Min</div>
          <div className="stat-value">{min}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Avg</div>
          <div className="stat-value">{avg}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Max</div>
          <div className="stat-value">{max}</div>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BarChart;


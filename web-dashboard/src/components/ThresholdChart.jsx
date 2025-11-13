import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './ThresholdChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ThresholdChart = ({ data, threshold = 1800 }) => {
  const chartData = {
    labels: data.map(d => d.time),
    datasets: [
      {
        label: 'Light Level',
        data: data.map(d => d.light),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: data.map(d => d.light < threshold ? '#E74C3C' : '#6366f1'),
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        borderWidth: 2,
      },
      {
        label: 'Threshold',
        data: data.map(() => threshold),
        borderColor: '#E74C3C',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderDash: [5, 5],
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 12,
            weight: '500',
          },
          color: '#64748b',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
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
            if (context.datasetIndex === 0) {
              const value = context.parsed.y;
              const status = value < threshold ? '⚠️ Below' : '✅ Above';
              return `${context.dataset.label}: ${value} ${status}`;
            }
            return `${context.dataset.label}: ${context.parsed.y}`;
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
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    animation: {
      duration: 750,
    },
  };

  return (
    <div className="threshold-chart-wrapper">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ThresholdChart;


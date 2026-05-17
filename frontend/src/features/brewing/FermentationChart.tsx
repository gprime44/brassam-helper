import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FermentationReading } from '../../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface FermentationChartProps {
  readings: FermentationReading[];
}

const FermentationChart: React.FC<FermentationChartProps> = ({ readings }) => {
  const data = {
    labels: readings.map(r => new Date(r.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Densité (Gravity)',
        data: readings.map(r => r.gravity),
        borderColor: 'rgb(75, 192, 192)',
        yAxisID: 'y',
      },
      {
        label: 'Température (°C)',
        data: readings.map(r => r.temperature),
        borderColor: 'rgb(255, 99, 132)',
        yAxisID: 'y1',
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: { type: 'linear' as const, position: 'left' as const },
      y1: { type: 'linear' as const, position: 'right' as const, grid: { drawOnChartArea: false } }
    }
  };

  return <Line options={options} data={data} />;
};

export default FermentationChart;

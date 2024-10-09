import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { BarChartData } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: BarChartData[];
}

export default function BarChart({ data }: BarChartProps) {
  if (!data || data.length === 0) {
    return <div>No data available for the bar chart.</div>;
  }

  const chartData = {
    labels: data.map(item => item.range),
    datasets: [
      {
        label: 'Number of Items',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Price Range Distribution',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
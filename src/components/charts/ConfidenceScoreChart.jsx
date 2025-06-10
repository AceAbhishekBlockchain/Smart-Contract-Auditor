import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ConfidenceScoreChart = ({ vulnerabilities }) => {
  if (!vulnerabilities || vulnerabilities.length === 0) {
    return (
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-purple-300">Confidence Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-4">No vulnerabilities detected to display confidence scores.</p>
        </CardContent>
      </Card>
    );
  }

  const data = {
    labels: vulnerabilities.map(v => `${v.type.substring(0,15)}${v.type.length > 15 ? '...' : ''} (ID: ${v.id.slice(-4)})`),
    datasets: [
      {
        label: 'Confidence Score (%)',
        data: vulnerabilities.map(v => v.confidence * 100),
        backgroundColor: vulnerabilities.map(v => {
          if (v.confidence > 0.85) return 'rgba(52, 211, 153, 0.7)'; // High confidence - emerald
          if (v.confidence > 0.65) return 'rgba(250, 204, 21, 0.7)'; // Medium confidence - yellow
          return 'rgba(248, 113, 113, 0.7)'; // Lower confidence - red
        }),
        borderColor: vulnerabilities.map(v => {
          if (v.confidence > 0.85) return 'rgba(52, 211, 153, 1)';
          if (v.confidence > 0.65) return 'rgba(250, 204, 21, 1)';
          return 'rgba(248, 113, 113, 1)';
        }),
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: vulnerabilities.map(v => {
          if (v.confidence > 0.85) return 'rgba(52, 211, 153, 0.9)';
          if (v.confidence > 0.65) return 'rgba(250, 204, 21, 0.9)';
          return 'rgba(248, 113, 113, 0.9)';
        }),
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(71, 85, 105, 0.5)', // slate-600
        },
        ticks: {
          color: '#94a3b8', // slate-400
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#cbd5e1', // slate-300
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.9)', // slate-800
        titleColor: '#f1f5f9', // slate-100
        bodyColor: '#cbd5e1', // slate-300
        padding: 10,
        cornerRadius: 4,
        borderColor: 'rgba(71, 85, 105, 1)', // slate-600
        borderWidth: 1,
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.x !== null) {
                    label += context.parsed.x.toFixed(0) + '%';
                }
                return label;
            }
        }
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    }
  };

  return (
    <Card className="bg-slate-800/70 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-purple-300">Vulnerability Confidence Scores</CardTitle>
      </CardHeader>
      <CardContent className="h-80 md:h-96">
        <Bar data={data} options={options} />
      </CardContent>
    </Card>
  );
};

export default ConfidenceScoreChart;
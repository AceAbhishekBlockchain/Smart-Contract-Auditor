import React from 'react';
import { PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend, Title);

const PredictionLikelihoodChart = ({ predictedVulnerabilities }) => {
  if (!predictedVulnerabilities || predictedVulnerabilities.length === 0) {
    return (
      <Card className="bg-slate-800/70 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl text-pink-300">Prediction Likelihoods</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center py-4">No predictions available to display.</p>
        </CardContent>
      </Card>
    );
  }

  const likelihoodToNumeric = (likelihood) => {
    if (likelihood === 'High') return 3;
    if (likelihood === 'Medium') return 2;
    if (likelihood === 'Low') return 1;
    return 0;
  };

  const data = {
    labels: predictedVulnerabilities.map(pv => `${pv.type} (${pv.likelihood})`),
    datasets: [
      {
        label: 'Likelihood Score',
        data: predictedVulnerabilities.map(pv => likelihoodToNumeric(pv.likelihood)),
        backgroundColor: [
          'rgba(219, 39, 119, 0.6)',  // Pink
          'rgba(236, 72, 153, 0.6)',  // Rose
          'rgba(217, 70, 239, 0.6)',  // Fuchsia
          'rgba(168, 85, 247, 0.6)',  // Purple
          'rgba(124, 58, 237, 0.6)',  // Violet
        ],
        borderColor: [
          'rgba(219, 39, 119, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(217, 70, 239, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(124, 58, 237, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
            display: true,
            color: 'rgba(100, 116, 139, 0.5)', // slate-500
        },
        grid: {
          color: 'rgba(71, 85, 105, 0.5)', // slate-600
        },
        pointLabels: {
          color: '#cbd5e1', // slate-300
          font: {
            size: 11,
          },
          padding: 5,
        },
        ticks: {
          color: '#94a3b8', // slate-400
          backdropColor: 'rgba(30, 41, 59, 0.75)', // slate-800 with opacity
          backdropPadding: 3,
          z: 1,
          stepSize: 1,
          callback: function(value) {
            if (value === 3) return 'High';
            if (value === 2) return 'Medium';
            if (value === 1) return 'Low';
            return '';
          }
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0', // slate-200
          font: {
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
        },
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
            const likelihoodValue = context.raw;
            if (likelihoodValue === 3) label += 'High';
            else if (likelihoodValue === 2) label += 'Medium';
            else if (likelihoodValue === 1) label += 'Low';
            else label += 'Unknown';
            return label;
          }
        }
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeOutQuint'
    }
  };

  return (
    <Card className="bg-slate-800/70 border-slate-700">
      <CardHeader>
        <CardTitle className="text-xl text-pink-300">Predicted Vulnerability Likelihoods</CardTitle>
      </CardHeader>
      <CardContent className="h-80 md:h-96">
        <PolarArea data={data} options={options} />
      </CardContent>
    </Card>
  );
};

export default PredictionLikelihoodChart;
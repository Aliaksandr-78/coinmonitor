import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

interface HistoryData {
  time: number
  priceUsd: string
}

interface ChartProps {
  data: HistoryData[]
  useLogScale?: boolean // Optional: Toggle for logarithmic scale
}

const Chart: React.FC<ChartProps> = ({ data, useLogScale = false }) => {
  const prices = data.map((point) => parseFloat(point.priceUsd))
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  
  const buffer = (maxPrice - minPrice) * (data.length > 50 ? 0.1 : 0.05)
  const suggestedMin = minPrice - buffer
  const suggestedMax = maxPrice + buffer

  const formattedData: ChartData<'line'> = {
    labels: data.map((point) =>
      new Date(point.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    ),
    datasets: [
      {
        label: 'Price (USD)',
        data: prices,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96, 165, 250, 0.1)',
        borderWidth: 2,
        pointRadius: 2,
        pointBackgroundColor: '#60a5fa',
        fill: true,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index', 
        intersect: false, 
        callbacks: {
          label: (context) => `${context.parsed.y?.toFixed(2)} USD`,
        },
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db',
        borderWidth: 1,
        titleColor: '#6b7280',
        bodyColor: '#1f2937',
        padding: 8,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 12 },
          color: '#6b7280',
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: useLogScale ? 'logarithmic' : 'linear',
        beginAtZero: false,
        suggestedMin: suggestedMin,
        suggestedMax: suggestedMax,
        ticks: {
          font: { size: 12 },
          color: '#6b7280',
          callback: (value) => `${value}`,
        },
        grid: {
          color: '#e5e7eb',
        },
      },
    },
  }

  return (
    <div className="w-full" style={{ height: 'calc(50vh + 100px)' }}>
      <Line data={formattedData} options={options} />
    </div>
  )
}

export default Chart

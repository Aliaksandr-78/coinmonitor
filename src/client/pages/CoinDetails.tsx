import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCoinDetails, fetchCoinHistory } from '../api/coincap'
import Button from '../components/Button/Button'
import Spinner from "../components/Spinner/Spinner"
import Chart from '../components/Chart/Chart'
import BuyCoinModal from '../components/BuyCoinModal/BuyCoinModal'

interface Coin {
  id: string
  name: string
  symbol: string
  rank: number
  supply: string
  priceUsd: string
  marketCapUsd: string
  maxSupply: string | null
}

interface HistoryData {
  time: number
  priceUsd: string
}

const CoinDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [coin, setCoin] = useState<Coin | null>(null)
  const [loadingCoin, setLoadingCoin] = useState<boolean>(true)
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<HistoryData[]>([])
  const [interval, setInterval] = useState<string>('d1')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const loadCoinDetails = useCallback(async () => {
    setLoadingCoin(true)
    setError(null)
    try {
      const coinData: Coin = await fetchCoinDetails(id!)
      setCoin(coinData)
      sessionStorage.setItem(`coin_${id}`, JSON.stringify({ coinData, timestamp: Date.now() }))
    } catch (err) {
      console.error(err)
      setError('Не удалось загрузить данные о монете.')
    }
    setLoadingCoin(false)
  }, [id])

  const loadCoinHistory = useCallback(async () => {
    setLoadingHistory(true)
    setError(null)
    try {
      const end = Date.now()
      let start
      switch (interval) {
        case 'h1':
          start = end - 3600000
          break
        case 'h12':
          start = end - 43200000
          break
        case 'd1':
          start = end - 86400000
          break
        default:
          start = end - 86400000
      }
      const historyData: HistoryData[] = await fetchCoinHistory(id!, interval, start, end)
      setHistory(historyData)
      sessionStorage.setItem(`history_${id}_${interval}`, JSON.stringify({ historyData, timestamp: Date.now() }))
    } catch (err) {
      console.error(err)
      setError('Не удалось загрузить историю цен.')
    }
    setLoadingHistory(false)
  }, [id, interval])

  useEffect(() => {
    const cacheExpiryTime = 5 * 60 * 1000
    if (!id) {
      setError("ID монеты не найден")
      setLoadingCoin(false)
      setLoadingHistory(false)
      return
    }
    
    const cachedCoin = sessionStorage.getItem(`coin_${id}`)
    const cachedHistory = sessionStorage.getItem(`history_${id}_${interval}`)

    if (cachedCoin) {
      const { coinData, timestamp } = JSON.parse(cachedCoin)
      if (Date.now() - timestamp < cacheExpiryTime) {
        setCoin(coinData)
        setLoadingCoin(false)
      } else {
        loadCoinDetails()
      }
    } else {
      loadCoinDetails()
    }

    if (cachedHistory) {
      const { historyData, timestamp } = JSON.parse(cachedHistory)
      if (Date.now() - timestamp < cacheExpiryTime) {
        setHistory(historyData)
        setLoadingHistory(false)
      } else {
        loadCoinHistory()
      }
    } else {
      loadCoinHistory()
    }
  }, [loadCoinDetails, loadCoinHistory, id, interval])

  const handleRetry = () => {
    loadCoinDetails()
    loadCoinHistory()
  }

  const handleAddClick = () => {
    setIsModalOpen(true)
  }

  if (loadingCoin || loadingHistory) return <Spinner />

  if (error) {
    return (
      <div className="text-red-600 text-center mt-4">
        {error}
        <Button onClick={handleRetry} className="bg-red-500 text-white mt-4 px-4 py-2 rounded-md">
          Повторить
        </Button>
      </div>
    )
  }

  if (!coin) return <div className="text-gray-600 text-center mt-4">Монета не найдена.</div>;

  const intervals = [
    { value: 'h1', label: '1 час' },
    { value: 'h12', label: '12 часов' },
    { value: 'd1', label: 'День' },
  ]

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 bg-gray-50 rounded-lg shadow-md">
      <Button
        onClick={() => navigate(-1)}
        className="bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 active:bg-primary-700 px-4 py-2 rounded-md transition-colors mb-4"
      >
        Вернуться назад
      </Button>
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <img
          src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
          alt={`${coin.name}`}
          className="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-gray-300"
        />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
          {coin.name} <span className="text-gray-500">({coin.symbol})</span>
        </h1>
      </div>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
        <p><span className="font-semibold">Rank:</span> {coin.rank}</p>
        <p><span className="font-semibold">Supply:</span> {parseFloat(coin.supply).toLocaleString()}</p>
        <p><span className="font-semibold">Цена (USD):</span> {parseFloat(coin.priceUsd).toFixed(2)}$</p>
        <p><span className="font-semibold">Рыночная капитализация (USD):</span> {parseFloat(coin.marketCapUsd).toLocaleString()}$</p>
        <p><span className="font-semibold">Max Supply:</span> {coin.maxSupply ? parseFloat(coin.maxSupply).toLocaleString() : 'N/A'}</p>
      </div>
      <div className="mb-8">
        <div className="flex flex-wrap space-x-2 space-y-2 sm:space-y-0 mb-4">
          {intervals.map(({ value, label }) => (
            <div
              key={value}
              onClick={() => setInterval(value)}
              className={`cursor-pointer py-2 px-4 rounded-md border transition-colors ${
                interval === value
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
        <Chart data={history.length ? history : []} />
      </div>
      <Button
        onClick={handleAddClick} 
        className="bg-accent text-white border border-accent-500 hover:bg-accent-600 active:bg-accent-700 px-4 py-2 rounded-md transition-colors"
      >
        Добавить
      </Button>
      {isModalOpen && (
        <BuyCoinModal
          isOpen={isModalOpen}
          coin={coin}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

export default CoinDetails

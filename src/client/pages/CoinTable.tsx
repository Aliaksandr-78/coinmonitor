import { useEffect, useState, useCallback } from 'react'
import { fetchCoins } from '../api/coincap'
import { useNavigate } from 'react-router-dom'
import Table from '../components/Table/Table'
import Button from '../components/Button/Button'
import Input from '../components/Input/Input'
import { formatValue } from '../services/formatValue'
import BuyCoinModal from '../components/BuyCoinModal/BuyCoinModal'

export interface Coin {
  id: string
  symbol: string
  name: string
  priceUsd: string
  marketCapUsd: string
  changePercent24Hr: string
  logoUrl: string
}

const CoinTable: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>('')
  const [limit] = useState<number>(20)
  const [offset, setOffset] = useState<number>(0)
  const [sortBy, setSortBy] = useState<string>('marketCapUsd')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null)

  const navigate = useNavigate()

  const loadCoins = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchCoins(limit, offset, search)
      setCoins(data)
    } catch (error) {
      console.error('Ошибка загрузки данных о монетах:', error)
    }
    setLoading(false)
  }, [limit, offset, search])

  useEffect(() => {
    loadCoins()
  }, [loadCoins])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const sortedCoins = [...coins].sort((a, b) => {
    let valueA: number
    let valueB: number
    if (sortBy === 'priceUsd' || sortBy === 'marketCapUsd' || sortBy === 'changePercent24Hr') {
      valueA = parseFloat(a[sortBy as keyof Coin])
      valueB = parseFloat(b[sortBy as keyof Coin])
    } else {
      valueA = a[sortBy as keyof Coin] as unknown as number
      valueB = b[sortBy as keyof Coin] as unknown as number
    }
    if (sortOrder === 'asc') {
      return valueA > valueB ? 1 : -1
    } else {
      return valueA < valueB ? 1 : -1
    }
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setOffset(0)
  }

  const handleAddClick = (coin: Coin) => {
    setSelectedCoin(coin)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCoin(null)
  }

  const tableHeaders = ['Символ', 'Логотип', 'Цена (USD)', 'Рыночная капитализация (USD)', 'Изменение за 24ч', 'Действие']

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 lg:p-8">
        <div className="mb-4">
          <Input
            value={search}
            onChange={handleSearchChange}
            placeholder="Поиск по названию монеты"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="block md:hidden mb-4">
          <div className="flex justify-between">
            <Button onClick={() => handleSort('priceUsd')} className="bg-primary-500 text-white px-4 py-2 rounded-md">
              Цена {sortBy === 'priceUsd' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </Button>
            <Button onClick={() => handleSort('marketCapUsd')} className="bg-primary-500 text-white px-4 py-2 rounded-md">
              Капитализация {sortBy === 'marketCapUsd' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </Button>
            <Button onClick={() => handleSort('changePercent24Hr')} className="bg-primary-500 text-white px-4 py-2 rounded-md">
              Изменение {sortBy === 'changePercent24Hr' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </Button>
          </div>
        </div>
        <div className="hidden md:block">
          <Table
            headers={tableHeaders}
            className="w-full border-collapse rounded-lg overflow-hidden"
            onSort={(columnIndex) => {
              const field = ['symbol', 'logoUrl', 'priceUsd', 'marketCapUsd', 'changePercent24Hr'][columnIndex]
              handleSort(field)
            }}
          >
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center">Загрузка...</td>
              </tr>
            ) : (
              sortedCoins.map((coin) => (
                <tr key={coin.id} className="hover:bg-primary-100 cursor-pointer transition-colors">
                  <td onClick={() => navigate(`/coin/${coin.id}`)} className="p-2 border-b border-gray-200">{coin.symbol}</td>
                  <td onClick={() => navigate(`/coin/${coin.id}`)} className="p-2 border-b border-gray-200 hidden sm:table-cell">
                    <img 
                      src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} 
                      alt={`${coin.name}`} 
                      className="h-8 w-8 rounded-full" />
                  </td>
                  <td onClick={() => navigate(`/coin/${coin.id}`)} className="p-2 border-b border-gray-200">{formatValue(coin.priceUsd)}</td>
                  <td onClick={() => navigate(`/coin/${coin.id}`)} className="p-2 border-b border-gray-200 hidden md:table-cell">{formatValue(coin.marketCapUsd)}</td>
                  <td onClick={() => navigate(`/coin/${coin.id}`)} className="p-2 border-b border-gray-200 hidden lg:table-cell">{isNaN(parseFloat(coin.changePercent24Hr)) ? ' ' : `${parseFloat(coin.changePercent24Hr).toFixed(2)}%`}</td>
                  <td className="p-2 border-b border-gray-200">
                    <Button
                      onClick={() => handleAddClick(coin)}
                      className="bg-accent text-white px-3 py-1 rounded-md hover:bg-accent-600 transition-colors">
                      Добавить
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </Table>
        </div>
        <div className="block md:hidden">
          {loading ? (
            <div className="text-center">Загрузка...</div>
          ) : (
            sortedCoins.map((coin) => (
              <div key={coin.id} className="bg-gray-50 rounded-lg shadow-md p-4 mb-4">
                <div onClick={() => navigate(`/coin/${coin.id}`)} className="cursor-pointer">
                  <div className="flex items-center space-x-4 mb-2">
                    <img
                      src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                      alt={`${coin.name}`}
                      className="h-8 w-8 rounded-full"
                    />
                    <h3 className="text-lg font-semibold">{coin.symbol}</h3>
                  </div>
                  <p>Цена (USD): {formatValue(coin.priceUsd)}$</p>
                  <p>Рыночная капитализация (USD): {formatValue(coin.marketCapUsd)}$</p>
                  <p>Изменение за 24ч: {parseFloat(coin.changePercent24Hr).toFixed(2)}%</p>
                </div>
                <Button
                  onClick={() => handleAddClick(coin)}
                  className="bg-accent text-white w-full mt-2 rounded-md hover:bg-accent-600 transition-colors">
                  Добавить
                </Button>
              </div>
            ))
          )}
        </div>
        <div className="flex flex-col sm:flex-row justify-between mt-4">
          <Button onClick={() => setOffset(Math.max(0, offset - limit))} disabled={offset === 0} className="bg-primary-500 text-white px-4 py-2 rounded-md disabled:bg-primary-300">
            Назад
          </Button>
          <Button onClick={() => setOffset(offset + limit)} disabled={coins.length < limit} className="bg-primary-500 text-white px-4 py-2 rounded-md disabled:bg-primary-300 mt-2 sm:mt-0">
            Вперед
          </Button>
        </div>
      </div>
      {selectedCoin && (
        <BuyCoinModal
          isOpen={isModalOpen}
          coin={selectedCoin}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default CoinTable

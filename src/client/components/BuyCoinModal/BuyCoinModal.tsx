import { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'
import { PortfolioItem, addCoinToPortfolio } from '../../services/portfolioService'
import { fetchCoinPrice } from '../../api/coincap'

interface BuyCoinModalProps {
  isOpen: boolean
  coin: {
    id: string
    name: string
    priceUsd: string
  }
  onClose: () => void
}

const BuyCoinModal: React.FC<BuyCoinModalProps> = ({ isOpen, coin, onClose }) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [currentPrice, setCurrentPrice] = useState<number>(parseFloat(coin.priceUsd))

  useEffect(() => {
    const updatePrice = async () => {
      try {
        const latestCoinData = await fetchCoinPrice(coin.id)
        setCurrentPrice(parseFloat(latestCoinData.priceUsd))
      } catch (error) {
        console.error('Ошибка при обновлении цены:', error)
      }
    }

    if (isOpen) {
      updatePrice()
    }
  }, [isOpen, coin.id])

  const handleBuy = async () => {
    if (quantity < 1) {
      alert('Минимальное количество монет для покупки: 1')
      return
    }

    try {
      const latestCoinData = await fetchCoinPrice(coin.id)
      const latestPrice = parseFloat(latestCoinData.priceUsd)
      setCurrentPrice(latestPrice)

      const portfolioItem: PortfolioItem = {
        id: coin.id,
        name: coin.name,
        quantity,
        purchasePrice: latestPrice,
        date: new Date().toISOString(),
      }

      addCoinToPortfolio(portfolioItem)
      onClose()
    } catch (error) {
      console.error('Ошибка при покупке монеты:', error)
      alert('Не удалось завершить покупку. Попробуйте еще раз.')
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    if (value >= 1) {
      setQuantity(value)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center p-4 sm:p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">Купить {coin.name}</h2>
        <div className="mb-6">
          <label className="block text-gray-600 mb-2">Количество:</label>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>
        <div className="mb-6">
          <p className="text-lg text-gray-700">
            Общая стоимость: <span className="font-semibold text-gray-800">${(currentPrice * quantity).toFixed(2)}</span>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onClose}
            className="bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 active:bg-primary-700 px-4 py-2 rounded-md transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleBuy}
            className="bg-primary-500 text-white border border-primary-500 hover:bg-primary-600 active:bg-primary-700 px-4 py-2 rounded-md transition-colors"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default BuyCoinModal

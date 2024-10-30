import { useEffect, useState, useCallback, useMemo } from 'react'
import Modal from '../Modal/Modal'
import { fetchCoinPrice } from '../../api/coincap'
import { PortfolioItem, getPortfolio, removeCoinFromPortfolio } from '../../services/portfolioService'
import { formatValue } from '../../services/formatValue'

const Header: React.FC = () => {
  const [cryptoPrices, setCryptoPrices] = useState<{ [key: string]: number }>({})
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const loadCryptoPrices = useCallback(async () => {
    try {
      setIsLoading(true)
      const [bitcoin, ethereum, litecoin] = await Promise.all([
        fetchCoinPrice('bitcoin'),
        fetchCoinPrice('ethereum'),
        fetchCoinPrice('litecoin'),
      ])
      setCryptoPrices({
        bitcoin: parseFloat(bitcoin.priceUsd),
        ethereum: parseFloat(ethereum.priceUsd),
        litecoin: parseFloat(litecoin.priceUsd),
      })
    } catch (error) {
      console.error('Ошибка загрузки цен криптовалют:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCryptoPrices()
  }, [loadCryptoPrices])

  useEffect(() => {
    setPortfolio(getPortfolio())
  }, [])

  const { currentTotalValue, portfolioChangeValue, portfolioChangePercent } = useMemo(() => {
    if (portfolio.length === 0) {
      return { currentTotalValue: 0, portfolioChangeValue: 0, portfolioChangePercent: 0 }
    }

    let initialTotalValue = 0
    let currentTotalValue = 0

    portfolio.forEach((coin) => {
      initialTotalValue += coin.quantity * coin.purchasePrice
      currentTotalValue += coin.quantity * (cryptoPrices[coin.name.toLowerCase()] || 0)
    })

    const portfolioChangeValue = currentTotalValue - initialTotalValue
    const portfolioChangePercent = initialTotalValue !== 0 ? (portfolioChangeValue / initialTotalValue) * 100 : 0

    return { currentTotalValue, portfolioChangeValue, portfolioChangePercent }
  }, [portfolio, cryptoPrices])

  const handlePortfolioClick = useCallback(() => {
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleRemoveCoin = useCallback((coinId: string, purchaseDate: string) => {
    removeCoinFromPortfolio(coinId, purchaseDate)
    setPortfolio(getPortfolio())
  }, [])

  return (
    <header className="bg-gray-900 text-white p-4 flex flex-col sm:flex-row justify-between items-center shadow-lg space-y-3 sm:space-y-0">
      <div className="flex flex-col sm:flex-row sm:space-x-3">
        {isLoading ? (
          <span className="text-sm">Загрузка...</span>
        ) : (
          <>
            <span className="text-xs sm:text-sm">
              Bitcoin: {cryptoPrices.bitcoin ? `$${formatValue(cryptoPrices.bitcoin.toString())}` : 'N/A'}
            </span>
            <span className="text-xs sm:text-sm">
              Ethereum: {cryptoPrices.ethereum ? `$${formatValue(cryptoPrices.ethereum.toString())}` : 'N/A'}
            </span>
            <span className="text-xs sm:text-sm">
              Litecoin: {cryptoPrices.litecoin ? `$${formatValue(cryptoPrices.litecoin.toString())}` : 'N/A'}
            </span>
          </>
        )}
      </div>
      <div
        className="cursor-pointer text-green-400 hover:text-green-500 font-bold text-base sm:text-lg"
        onClick={handlePortfolioClick}
      >
        {currentTotalValue.toFixed(2)} USD {portfolioChangeValue >= 0 ? '+' : ''}
        {portfolioChangeValue.toFixed(2)} ({portfolioChangePercent.toFixed(2)}%)
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Портфель пользователя</h2>
          {portfolio.length > 0 ? (
            <ul className="space-y-2">
              {portfolio.map((coin) => (
                <li key={`${coin.id}-${coin.date}`} className="flex justify-between items-center bg-gray-200 p-2 rounded-lg shadow-sm">
                  <div className="text-gray-800 text-xs sm:text-sm">
                    {coin.name}: {coin.quantity} шт. по цене {coin.purchasePrice} USD
                  </div>
                  <button
                    className="text-red-600 hover:text-red-800 font-bold transition-colors duration-200 text-xs sm:text-sm"
                    onClick={() => handleRemoveCoin(coin.id, coin.date)}
                  >
                    Удалить
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Портфель пуст.</p>
          )}
        </div>
      </Modal>
    </header>
  )
}

export default Header

import BuyCoinModal from './BuyCoinModal'
import { Coin } from '../../pages/CoinTable'

export default {
  title: 'Components/BuyCoinModal',
  component: BuyCoinModal,
}

const sampleCoin: Coin = {
  id: 'bitcoin',
  symbol: 'BTC',
  name: 'Bitcoin',
  priceUsd: '50000',
  marketCapUsd: '1000000000',
  changePercent24Hr: '2.5',
  logoUrl: 'https://assets.coincap.io/assets/icons/btc@2x.png',
}

export const Default = () => (
  <BuyCoinModal
    isOpen={true}
    coin={sampleCoin}
    onClose={() => console.log('Modal закрыт')}
  />
)

export interface PortfolioItem {
    id: string
    name: string
    quantity: number
    purchasePrice: number
    date: string 
  }
  
  export const getPortfolio = (): PortfolioItem[] => {
    const portfolio = localStorage.getItem('portfolio')
    return portfolio ? JSON.parse(portfolio) : []
  }
  
  export const addCoinToPortfolio = (coin: PortfolioItem) => {
    const portfolio = getPortfolio()
    portfolio.push(coin)
    localStorage.setItem('portfolio', JSON.stringify(portfolio))
  }
  
  
  export const removeCoinFromPortfolio = (coinId: string, purchaseDate: string) => {
    const portfolio = getPortfolio().filter(
      (coin) => !(coin.id === coinId && coin.date === purchaseDate)
    )
    localStorage.setItem('portfolio', JSON.stringify(portfolio))
  }
  
  
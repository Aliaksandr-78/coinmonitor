interface Window {
    simulatePriceChange: (coin: string, price: number) => void
    simulateApiError: (coin: string) => void
  }
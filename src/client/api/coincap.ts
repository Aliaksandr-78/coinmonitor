import axios from 'axios'

const API_URL = 'https://api.coincap.io/v2'

export const fetchCoins = async (limit: number, offset: number, search: string) => {
  const response = await axios.get(`${API_URL}/assets`, {
    params: { limit, offset, search },
  })
  return response.data.data
}

export const fetchCoinDetails = async (id: string) => {
  const response = await axios.get(`${API_URL}/assets/${id}`)
  return response.data.data
}

export const fetchCoinHistory = async (id: string, interval: string, start: number, end: number) => {
  let apiInterval;

  switch (interval) {
    case 'h1':
      apiInterval = 'm1'
      break
    case 'h12':
      apiInterval = 'm5'
      break
    case 'd1':
      apiInterval = 'm30'
      break
    default:
      apiInterval = 'm30'
  }

  const response = await axios.get(`${API_URL}/assets/${id}/history`, {
    params: { interval: apiInterval, start, end },
  })
  
  return response.data.data
}

export const fetchCoinPrice = async (id: string) => {
  const response = await axios.get(`${API_URL}/assets/${id}`)
  return response.data.data
}

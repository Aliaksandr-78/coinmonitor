export const formatValue = (value: string) => {
    const num = parseFloat(value)
  
    if (isNaN(num) || num === 0) return ' '
  
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}b$`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}m$`
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}k$`
  
    if (num < 1 && num >= 0.01) return `${num.toFixed(2)}$`
  
    if (num < 0.01 && num > 0) return `${num.toFixed(6)}$`
  
    return `${num.toFixed(2)}$`
  }
  
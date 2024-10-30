import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CoinTable from '../src/client/pages/CoinTable'
import CoinDetails from '../src/client/pages/CoinDetails'
import Header from './client/components/Header/Header'
import './App.css'

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Header />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<CoinTable />} />
            <Route path="/coin/:id" element={<CoinDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

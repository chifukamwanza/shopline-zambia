import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Sellers from './pages/Sellers'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Footer from './components/Footer'
import './app.css'

export default function App() {
  return (
    <Router>
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/sellers" element={<Sellers />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}
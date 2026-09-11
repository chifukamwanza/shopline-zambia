import { Link } from 'react-router-dom'
import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          🛍️ Shopline Zambia
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/sellers" className="nav-link">Sellers</Link>
          <Link to="/dashboard" className="nav-link">Sell</Link>
          <button className="btn-primary">Sign In</button>
        </nav>
      </div>
    </header>
  )
}
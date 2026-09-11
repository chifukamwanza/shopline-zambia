import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  const featuredProducts = [
    { id: 1, name: 'Handmade Basket', price: 150, seller: 'Local Crafts', image: '🧺' },
    { id: 2, name: 'Organic Coffee', price: 80, seller: 'Kafue Farm', image: '☕' },
    { id: 3, name: 'Beaded Necklace', price: 200, seller: 'Art Collective', image: '📿' },
    { id: 4, name: 'Shea Butter', price: 120, seller: 'Natural Beauty', image: '🧴' },
  ]

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Shopline Zambia</h1>
          <p>Buy & Sell marketplace for African countries</p>
          <p className="hero-subtitle">100% Free. No Hidden Fees. No Commissions.</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-large btn-primary">
              Browse Products
            </Link>
            <Link to="/dashboard" className="btn btn-large btn-secondary">
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      <section className="featured">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.image}</div>
              <h3>{product.name}</h3>
              <p className="seller">by {product.seller}</p>
              <p className="price">ZMW {product.price}</p>
              <button className="btn btn-small">View</button>
            </div>
          ))}
        </div>
      </section>

      <section className="features">
        <h2>Why Choose Shopline?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Completely Free</h3>
            <p>No commission. No hidden fees. Sell everything you want for free.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Pan-African</h3>
            <p>Connect with buyers and sellers across Africa.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Safe</h3>
            <p>Protected transactions and verified sellers.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile Friendly</h3>
            <p>Shop and sell from anywhere on any device.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
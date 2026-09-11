import './Sellers.css'

export default function Sellers() {
  const sellers = [
    { id: 1, name: 'Local Crafts', rating: 4.8, products: 24, icon: '🏪' },
    { id: 2, name: 'Kafue Farm', rating: 4.9, products: 15, icon: '🌾' },
    { id: 3, name: 'Art Collective', rating: 4.7, products: 42, icon: '🎨' },
    { id: 4, name: 'Natural Beauty', rating: 5.0, products: 18, icon: '🌿' },
    { id: 5, name: 'Bee Farm', rating: 4.6, products: 8, icon: '🐝' },
    { id: 6, name: 'Leather Art', rating: 4.8, products: 12, icon: '🎯' },
  ]

  return (
    <div className="sellers-page">
      <h1>Top Sellers</h1>
      <p className="subtitle">Connect with trusted sellers in our community</p>

      <div className="sellers-grid">
        {sellers.map(seller => (
          <div key={seller.id} className="seller-card">
            <div className="seller-icon">{seller.icon}</div>
            <h3>{seller.name}</h3>
            <div className="rating">
              <span className="stars">★★★★★</span>
              <span className="rating-value">{seller.rating}</span>
            </div>
            <p className="products-count">{seller.products} products</p>
            <button className="btn btn-primary">Visit Shop</button>
          </div>
        ))}
      </div>
    </div>
  )
}
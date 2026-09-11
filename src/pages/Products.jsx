import { useState } from 'react'
import './Products.css'

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const allProducts = [
    { id: 1, name: 'Handmade Basket', price: 150, category: 'crafts', seller: 'Local Crafts', image: '🧺' },
    { id: 2, name: 'Organic Coffee', price: 80, category: 'food', seller: 'Kafue Farm', image: '☕' },
    { id: 3, name: 'Beaded Necklace', price: 200, category: 'crafts', seller: 'Art Collective', image: '📿' },
    { id: 4, name: 'Shea Butter', price: 120, category: 'beauty', seller: 'Natural Beauty', image: '🧴' },
    { id: 5, name: 'Honey Jar', price: 90, category: 'food', seller: 'Bee Farm', image: '🍯' },
    { id: 6, name: 'Leather Purse', price: 280, category: 'fashion', seller: 'Leather Art', image: '👜' },
    { id: 7, name: 'Traditional Cloth', price: 350, category: 'fashion', seller: 'Textile Masters', image: '🧵' },
    { id: 8, name: 'Wooden Carvings', price: 450, category: 'crafts', seller: 'Wood Artisans', image: '🪵' },
  ]

  const categories = ['all', 'crafts', 'food', 'beauty', 'fashion']

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="products-page">
      <h1>Browse Products</h1>
      
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.image}</div>
              <h3>{product.name}</h3>
              <p className="seller">by {product.seller}</p>
              <p className="price">ZMW {product.price}</p>
              <button className="btn btn-primary">Add to Cart</button>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No products found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
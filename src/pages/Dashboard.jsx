import { useState } from 'react'
import './Dashboard.css'

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false)
  const [products, setProducts] = useState([
    { id: 1, name: 'Sample Product 1', price: 150, sales: 5 },
    { id: 2, name: 'Sample Product 2', price: 200, sales: 3 },
  ])
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'crafts',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newProduct = {
      id: products.length + 1,
      name: formData.name,
      price: parseFloat(formData.price),
      sales: 0
    }
    setProducts([...products, newProduct])
    setFormData({ name: '', price: '', description: '', category: 'crafts' })
    setShowForm(false)
  }

  const totalSales = products.reduce((sum, p) => sum + p.sales, 0)
  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0)

  return (
    <div className="dashboard-page">
      <h1>Seller Dashboard</h1>
      
      <div className="stats">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{products.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p className="stat-value">{totalSales}</p>
        </div>
        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-value">ZMW {totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Your Products</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm? 'Cancel' : '+ Add Product'}
          </button>
        </div>

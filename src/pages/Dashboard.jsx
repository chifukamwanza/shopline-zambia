import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import './Dashboard.css'

// YOUR SUPABASE CONNECTION
const supabaseUrl = 'https://kfusttbmgbxklwnexdyk.supabase.co'
const supabaseKey = 'sb_publishable_XGyHpQhM0l2YLZPrQSqSSg_I0axJuXd'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'crafts',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false })
    if (error) console.log('Error:', error)
    else setProducts(data)
    setLoading(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { data, error } = await supabase.from('products').insert([{
      name: formData.name, price: parseFloat(formData.price), description: formData.description, category: formData.category, sales: 0
    }]).select()
    if (error) alert('Error: ' + error.message)
    else {
      setProducts([data[0],...products])
      setFormData({ name: '', price: '', description: '', category: 'crafts' })
      setShowForm(false)
      alert('Product added!')
    }
  }

  const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0)
  const totalRevenue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.sales || 0)), 0)
return (
    <div className="dashboard-page">
      <h1>Seller Dashboard</h1>
      <div className="stats">
        <div className="stat-card"><h3>Total Products</h3><p className="stat-value">{products.length}</p></div>
        <div className="stat-card"><h3>Total Sales</h3><p className="stat-value">{totalSales}</p></div>
        <div className="stat-card"><h3>Revenue</h3><p className="stat-value">ZMW {totalRevenue.toFixed(2)}</p></div>
      </div>
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Your Products</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm? 'Cancel' : '+ Add Product'}
          </button>
        </div>
        {showForm && (
          <form className="product-form" onSubmit={handleSubmit}>
            <div className="form-group"><label>Product Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} required /></div>
            <div className="form-row">
              <div className="form-group"><label>Price (ZMW)</label><input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" required /></div>
              <div className="form-group"><label>Category</label><select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="crafts">Crafts</option><option value="food">Food</option><option value="beauty">Beauty</option><option value="fashion">Fashion</option>
              </select></div>
            </div>
            <div className="form-group"><label>Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="4"></textarea></div>
            <button type="submit" className="btn btn-primary btn-large">List Product</button>
          </form>
        )}
        {loading? <p>Loading...</p> : products.length > 0? (
          <div className="products-table"><table><thead><tr><th>Product</th><th>Price</th><th>Sales</th><th>Revenue</th></tr></thead>
          <tbody>{products.map(p => (<tr key={p.id}><td>{p.name}</td><td>ZMW {p.price}</td><td>{p.sales}</td><td>ZMW {((p.price || 0) * (p.sales || 0)).toFixed(2)}</td></tr>))}</tbody></table></div>
        ) : (<p>No products yet. Add your first product!</p>)}
      </div>
    </div>
  )
}
                                                        }

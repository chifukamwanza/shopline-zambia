import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', sales: 0 })

  // Load products from Supabase
  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (error) console.error(error)
    else setProducts(data)
    setLoading(false)
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault()
    const newProduct = { 
      name: form.name, 
      price: parseFloat(form.price), 
      sales: parseInt(form.sales) || 0 
    }
    
    const { error } = await supabase.from('products').insert([newProduct])
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Product Added!')
      setForm({ name: '', price: '', sales: 0 })
      setShowForm(false)
      fetchProducts()
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Shopline Zambia Dashboard</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          + Add Product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="product-form">
          <input 
            type="text" 
            placeholder="Product Name" 
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            required 
          />
          <input 
            type="number" 
            placeholder="Price ZMW" 
            value={form.price}
            onChange={(e) => setForm({...form, price: e.target.value})}
            required 
          />
          <button type="submit" className="btn btn-primary btn-large">List Product</button>
        </form>
      )}

      {loading? <p>Loading...</p> : products.length > 0? (
        <div className="products-table">
          <table>
            <thead>
              <tr><th>Product</th><th>Price</th><th>Sales</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>ZMW {p.price}</td>
                  <td>{p.sales}</td>
                  <td>ZMW {((p.price || 0) * (p.sales || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (<p>No products yet. Add your first product!</p>)}
    </div>
  )
    }

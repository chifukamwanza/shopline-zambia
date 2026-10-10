import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

function App() {
  const [page, setPage] = useState('home')
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('id', {ascending: false})
    if(data) setProducts(data)
  }

  async function addProduct(e) {
    e.preventDefault()
    const { error } = await supabase.from('products').insert([{ name, price: Number(price), sales: 0, revenue: 0 }])
    if(!error) { setName(''); setPrice(''); setShowForm(false); fetchProducts() }
  }

  if(page === 'home') {
    return (
      <div className="home-container">
        <h1>Welcome to<br/>Shopline Zambia</h1>
        <p>Marketplace for Zambian SMEs 🇿🇲</p>
        <button onClick={() => setPage('dashboard')}>Go to Seller Dashboard →</button>
      </div>
    )
  }

  const totalRevenue = products.reduce((sum, p) => sum + Number(p.price || 0), 0)

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Shopline Zambia <span>Dashboard</span></h1>
        <button className="btn-black" onClick={() => setShowForm(!showForm)}>+ Add Product</button>
      </div>

      <div className="stats">
        <div className="stat-card"><div className="label">Total Products</div><div className="value">{products.length}</div></div>
        <div className="stat-card"><div className="label">Inventory Value</div><div className="value">ZMW {totalRevenue}</div></div>
        <div className="stat-card"><div className="label">Active Sales</div><div className="value">0</div></div>
      </div>

      {showForm && (
        <form onSubmit={addProduct} style={{background:'white', padding:'20px', borderRadius:'16px', marginBottom:'20px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)'}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Product name e.g. Tecno Spark" required style={{padding:'12px', borderRadius:'10px', border:'1px solid #e5e7eb', marginRight:'10px', width:'200px'}}/>
          <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price ZMW" type="number" required style={{padding:'12px', borderRadius:'10px', border:'1px solid #e5e7eb', marginRight:'10px', width:'130px'}}/>
          <button type="submit">Save</button>
        </form>
      )}

      <table>
        <thead><tr><th>Product</th><th>Price</th><th>Sales</th><th>Revenue</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td><span className="price">ZMW {p.price}</span></td>
              <td>{p.sales || 0}</td>
              <td>ZMW {p.revenue || '0.00'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App

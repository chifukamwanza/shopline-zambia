import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'

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
    if(!error) { 
      setName(''); 
      setPrice(''); 
      setShowForm(false); 
      fetchProducts() 
    }
  }

  async function deleteProduct(id) {
    if(!confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if(!error) fetchProducts()
  }

  function orderWhatsApp(pName, pPrice) {
    const phone = "260970000000" // CHANGE THIS TO YOUR NUMBER
    const msg = `Hello! I want to order ${pName} for ZMW ${pPrice} from Shopline Zambia 🇿🇲`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
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
        <div className="stat-card">
          <div className="label">Total Products</div>
          <div className="value">{products.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Inventory Value</div>
          <div className="value">ZMW {totalRevenue}</div>
        </div>
        <div className="stat-card">
          <div className="label">Active Sales</div>
          <div className="value">0</div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={addProduct} style={{background:'white', padding:'20px', borderRadius:'16px', marginBottom:'20px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', display:'flex', gap:'10px', flexWrap:'wrap'}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Product name" required style={{padding:'12px', borderRadius:'10px', border:'1px solid #e5e7eb', width:'220px'}}/>
          <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price ZMW" type="number" required style={{padding:'12px', borderRadius:'10px', border:'1px solid #e5e7eb', width:'140px'}}/>
          <button type="submit">Save Product</button>
        </form>
      )}

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Sales</th>
            <th>WhatsApp</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td><span className="price">ZMW {p.price}</span></td>
              <td>{p.sales || 0}</td>
              <td><button onClick={() => orderWhatsApp(p.name, p.price)} style={{background:'#25D366', color:'white', border:'none', padding:'6px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer', fontWeight:'600'}}>💬 Order</button></td>
              <td><button onClick={() => deleteProduct(p.id)} style={{background:'#fee2e2', color:'#dc2626', border:'none', padding:'6px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer', fontWeight:'600'}}>🗑️ Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App

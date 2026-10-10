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
    if(!error) { setName(''); setPrice(''); setShowForm(false); fetchProducts() }
  }

  async function deleteProduct(id) {
    if(!confirm('Delete this product?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if(!error) fetchProducts()
  }

  function orderWhatsApp(pName, pPrice) {
    const phone = "260970757906" // CHANGE TO YOUR NUMBER
    const msg = `Hello! I want to order ${pName} for ZMW ${pPrice} from Shopline Zambia 🇿🇲`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  if(page === 'home') {
    return (
      <div style={{minHeight:'100vh', background:'linear-gradient(135deg, #f0fdf4, #ecfdf5, #eff6ff)', padding:'20px'}}>
        <div style={{maxWidth:'1000px', margin:'0 auto'}}>
          <h1 style={{fontSize:'48px', fontWeight:'800', textAlign:'center', lineHeight:'1.1', marginTop:'20px'}}>
            <span style={{color:'#111827'}}>Welcome to</span><br/>
            <span style={{background:'linear-gradient(to right, #16a34a, #15803d)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>Shopline Zambia</span>
          </h1>
          <p style={{textAlign:'center', color:'#6b7280', marginTop:'10px'}}>Marketplace for Zambian SMEs 🇿🇲 - {products.length} products live</p>
          <div style={{display:'flex', justifyContent:'center', marginTop:'20px'}}>
            <button onClick={() => setPage('dashboard')} style={{background:'black', color:'white', padding:'14px 28px', borderRadius:'999px', border:'none', fontWeight:'600', cursor:'pointer'}}>Seller Dashboard →</button>
          </div>

          <h2 style={{marginTop:'40px', fontSize:'24px', fontWeight:'700'}}>🛍️ Shop Now</h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:'16px', marginTop:'16px'}}>
            {products.map(p => (
              <div key={p.id} style={{background:'white', borderRadius:'20px', padding:'20px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:'1px solid #f3f4f6'}}>
                <div style={{fontSize:'48px', textAlign:'center'}}>📦</div>
                <h3 style={{fontWeight:'700', fontSize:'16px', marginTop:'12px'}}>{p.name}</h3>
                <div style={{background:'#dcfce7', color:'#166534', display:'inline-block', padding:'6px 14px', borderRadius:'999px', fontWeight:'800', marginTop:'10px', fontSize:'14px'}}>ZMW {p.price}</div>
                <button onClick={() => orderWhatsApp(p.name, p.price)} style={{display:'block', width:'100%', background:'#25D366', color:'white', border:'none', padding:'12px', borderRadius:'12px', fontWeight:'700', marginTop:'14px', cursor:'pointer'}}>💬 Order on WhatsApp</button>
              </div>
            ))}
          </div>
          {products.length === 0 && <p style={{textAlign:'center', color:'#9ca3af', marginTop:'30px'}}>No products yet. Go to dashboard to add.</p>}
        </div>
      </div>
    )
  }

  const totalRevenue = products.reduce((sum, p) => sum + Number(p.price || 0), 0)

  return (
    <div className="dashboard">
      <div className="dashboard-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h1>Shopline Zambia <span style={{color:'#16a34a'}}>Dashboard</span></h1>
        <div style={{display:'flex', gap:'8px'}}>
          <button onClick={() => setPage('home')} style={{background:'white', border:'1px solid #e5e7eb', padding:'10px 16px', borderRadius:'999px', cursor:'pointer'}}>🏠 Shop</button>
          <button className="btn-black" onClick={() => setShowForm(!showForm)} style={{background:'black', color:'white', padding:'10px 20px', borderRadius:'999px', border:'none', fontWeight:'600', cursor:'pointer'}}>+ Add Product</button>
        </div>
      </div>

      <div className="stats">
        <div className="stat-card"><div className="label">Total Products</div><div className="value">{products.length}</div></div>
        <div className="stat-card"><div className="label">Inventory Value</div><div className="value">ZMW {totalRevenue}</div></div>
        <div className="stat-card"><div className="label">Active Sales</div><div className="value">0</div></div>
      </div>

      {showForm && (
        <form onSubmit={addProduct} style={{background:'white', padding:'20px', borderRadius:'16px', marginBottom:'20px', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', display:'flex', gap:'10px', flexWrap:'wrap'}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Product name" required style={{padding:'12px', borderRadius:'10px', border:'1px solid #e5e7eb', width:'220px'}}/>
          <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price ZMW" type="number" required style={{padding:'12px', borderRadius:'10px', border:'1px solid #e5e7eb', width:'140px'}}/>
          <button type="submit" style={{background:'#16a34a', color:'white', border:'none', padding:'12px 20px', borderRadius:'10px', fontWeight:'700', cursor:'pointer'}}>Save Product</button>
        </form>
      )}

      <table>
        <thead><tr><th>Product</th><th>Price</th><th>WhatsApp</th><th>Delete</th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td><span className="price" style={{background:'#dcfce7', color:'#166534', padding:'4px 10px', borderRadius:'999px', fontWeight:'700'}}>ZMW {p.price}</span></td>
              <td><button onClick={() => orderWhatsApp(p.name, p.price)} style={{background:'#25D366', color:'white', border:'none', padding:'6px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer'}}>💬</button></td>
              <td><button onClick={() => deleteProduct(p.id)} style={{background:'#fee2e2', color:'#dc2626', border:'none', padding:'6px 12px', borderRadius:'8px', fontSize:'12px', cursor:'pointer'}}>🗑️</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App

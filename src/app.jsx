import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'

function App() {
  const [page, setPage] = useState('home')
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('Phones')
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')

  const categories = ['All', 'Phones', 'Clothes', 'Food', 'Electronics', 'Other']

  useEffect(() => { fetchProducts() }, [])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('id', {ascending: false})
    if(data) setProducts(data)
  }

  async function addProduct(e) {
    e.preventDefault()
    const { data, error } = await supabase.from('products').insert([{ 
      name, price: Number(price), image_url: imageUrl, category 
    }]).select()
    if(error) {
      alert('Error: ' + error.message)
      console.log(error)
    } else { 
      setName(''); setPrice(''); setImageUrl(''); 
      setShowForm(false); fetchProducts() 
    }
  }

  async function deleteProduct(id) {
    if(!confirm('Delete?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  function orderWhatsApp(pName, pPrice) {
    const phone = "260970757906"
    const msg = `Hello! I want to order ${pName} for ZMW ${pPrice} from Shopline Zambia 🇿🇲`
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCat === 'All' || p.category === selectedCat
    return matchesSearch && matchesCat
  })

  if(page === 'home') {
    return (
      <div style={{minHeight:'100vh', background:'linear-gradient(135deg, #f0fdf4, #ecfdf5, #eff6ff)', padding:'20px'}}>
        <div style={{maxWidth:'1100px', margin:'0 auto'}}>
          <h1 style={{fontSize:'44px', fontWeight:'800', textAlign:'center', lineHeight:'1.1', marginTop:'20px'}}>
            <span style={{color:'#111827'}}>Welcome to</span><br/>
            <span style={{background:'linear-gradient(to right, #16a34a, #15803d)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>Shopline Zambia</span>
          </h1>
          <p style={{textAlign:'center', color:'#6b7280', marginTop:'10px'}}>Marketplace for Zambian SMEs 🇿🇲 - {products.length} products live</p>
          <div style={{display:'flex', justifyContent:'center', marginTop:'20px', gap:'10px'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search products..." style={{padding:'12px 20px', borderRadius:'999px', border:'1px solid #e5e7eb', width:'300px'}}/>
            <button onClick={() => setPage('dashboard')} style={{background:'black', color:'white', padding:'12px 24px', borderRadius:'999px', border:'none', fontWeight:'600', cursor:'pointer'}}>Dashboard →</button>
          </div>
          <div style={{display:'flex', gap:'8px', flexWrap:'wrap', justifyContent:'center', marginTop:'20px'}}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCat(cat)} style={{padding:'8px 16px', borderRadius:'999px', border:'1px solid #e5e7eb', background: selectedCat===cat ? '#16a34a' : 'white', color: selectedCat===cat ? 'white' : '#374151', cursor:'pointer', fontWeight:'600', fontSize:'13px'}}>{cat}</button>
            ))}
          </div>
          <h2 style={{marginTop:'30px', fontSize:'22px', fontWeight:'700'}}>🛍️ {selectedCat} ({filtered.length})</h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'16px', marginTop:'16px'}}>
            {filtered.map(p => (
              <div key={p.id} style={{background:'white', borderRadius:'20px', overflow:'hidden', boxShadow:'0 4px 20px rgba(0,0,0,0.06)', border:'1px solid #f3f4f6'}}>
                {p.image_url ? <img src={p.image_url} alt={p.name} style={{width:'100%', height:'160px', objectFit:'cover'}} /> : <div style={{fontSize:'48px', textAlign:'center', padding:'30px 0', background:'#f9fafb'}}>📦</div>}
                <div style={{padding:'16px'}}>
                  <div style={{fontSize:'11px', color:'#16a34a', fontWeight:'700', textTransform:'uppercase'}}>{p.category || 'Other'}</div>
                  <h3 style={{fontWeight:'700', fontSize:'15px', marginTop:'4px'}}>{p.name}</h3>
                  <div style={{background:'#dcfce7', color:'#166534', display:'inline-block', padding:'6px 14px', borderRadius:'999px', fontWeight:'800', marginTop:'10px', fontSize:'14px'}}>ZMW {p.price}</div>
                  <button onClick={() => orderWhatsApp(p.name, p.price)} style={{display:'block', width:'100%', background:'#25D366', color:'white', border:'none', padding:'11px', borderRadius:'12px', fontWeight:'700', marginTop:'12px', cursor:'pointer'}}>💬 Order on WhatsApp</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{padding:'20px', background:'#f9fafb', minHeight:'100vh'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:'1100px', margin:'0 auto 20px'}}>
        <h1>Shopline Zambia <span style={{color:'#16a34a'}}>Dashboard</span></h1>
        <div style={{display:'flex', gap:'8px'}}>
          <button onClick={() => setPage('home')} style={{background:'white', border:'1px solid #e5e7eb', padding:'10px 16px', borderRadius:'999px', cursor:'pointer'}}>🏠 Shop</button>
          <button onClick={() => setShowForm(!showForm)} style={{background:'black', color:'white', padding:'10px 20px', borderRadius:'999px', border:'none', fontWeight:'600', cursor:'pointer'}}>+ Add Product</button>
        </div>
      </div>
      {showForm && (
        <form onSubmit={addProduct} style={{background:'white', padding:'20px', borderRadius:'16px', margin:'0 auto 20px', maxWidth:'1100px', display:'flex', gap:'10px', flexWrap:'wrap'}}>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Product name" required style={{padding:'12px', borderRadius:'10px', border:'1px solid #e5e7eb', flex:'1'}}/>
          <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" type="number" required style={{padding:'12px', borderRadius:'10px', border:'1px solid #e5e7eb', width:'120px'}}/>
          <input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="Image URL" style={{padding:'12px', borderRadius:'10px', border:'1px solid #e5e7eb', flex:'1'}}/>
          <select value={category} onChange={e=>setCategory(e.target.value)} style={{padding:'12px', borderRadius:'10px', border:'1px solid #e5e7eb'}}>{categories.filter(c=>c!=='All').map(c=><option key={c} value={c}>{c}</option>)}</select>
          <button type="submit" style={{background:'#16a34a', color:'white', border:'none', padding:'12px 20px', borderRadius:'10px', fontWeight:'700', cursor:'pointer'}}>Save</button>
        </form>
      )}
      <div style={{maxWidth:'1100px', margin:'0 auto', background:'white', borderRadius:'16px', padding:'20px'}}>
        <table style={{width:'100%', borderCollapse:'collapse'}}><thead><tr style={{textAlign:'left', color:'#6b7280', fontSize:'12px'}}><th style={{padding:'10px'}}>Product</th><th>Price</th><th>Category</th><th>Action</th></tr></thead>
        <tbody>{products.map(p => (<tr key={p.id} style={{borderTop:'1px solid #f3f4f6'}}><td style={{padding:'10px', display:'flex', alignItems:'center', gap:'10px'}}>{p.image_url && <img src={p.image_url} style={{width:'40px', height:'40px', borderRadius:'8px', objectFit:'cover'}}/>} {p.name}</td><td>ZMW {p.price}</td><td>{p.category||'-'}</td><td><button onClick={()=>deleteProduct(p.id)} style={{background:'#fee2e2', color:'#dc2626', border:'none', padding:'6px 12px', borderRadius:'8px', cursor:'pointer'}}>Delete</button></td></tr>))}</tbody></table>
      </div>
    </div>
  )
}
export default App Enter

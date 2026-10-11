import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'

function App() {
  const [page, setPage] = useState('home')
  const [products, setProducts] = useState([])
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [category, setCategory] = useState('Phones')
  const [sellerName, setSellerName] = useState('Shopline Zambia')
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('All')

  const categories = ['All', 'Phones', 'Clothes', 'Food', 'Electronics', 'Other']

  useEffect(() => { fetchProducts() }, [])

  function formatKwacha(amount) {
    return new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW', minimumFractionDigits: 0 }).format(amount || 0).replace('ZMW', 'ZMW ')
  }

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false })
    if (data) setProducts(data)
  }

  async function addProduct(e) {
    e.preventDefault()
    const { error } = await supabase.from('products').insert([{ 
      name, price: Number(price), image_url: imageUrl, category, seller_name: sellerName 
    }])
    if (error) alert(error.message)
    else {
      setName(''); setPrice(''); setImageUrl(''); 
      fetchProducts(); setShowForm(false)
    }
  }

  async function deleteProduct(id) {
    if (!confirm('Delete?')) return
    await supabase.from('products').delete().eq('id', id)
    fetchProducts()
  }

  function orderWhatsApp(p) {
    const msg = `Hello ${p.seller_name || 'Shopline'}! I want to order ${p.name} for ${formatKwacha(p.price)} from Shopline Zambia 🇿🇲\n\nProduct: ${p.name}\nPrice: ${formatKwacha(p.price)}\nSeller: ${p.seller_name || 'Shopline Zambia'}`
    window.open(`https://wa.me/260970757906?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const filtered = products.filter(p => {
    return p.name.toLowerCase().includes(search.toLowerCase()) && (selectedCat === 'All' || p.category === selectedCat)
  })

  if (page === 'home') {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)', padding: '20px' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '38px', fontWeight: '900', textAlign: 'center' }}>Shopline Zambia <span style={{ color: '#16a34a' }}>🇿🇲</span></h1>
          <p style={{ textAlign: 'center', color: '#6b7280' }}>{products.length} products • Zambian SMEs Marketplace</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." style={{ padding: '12px 18px', borderRadius: '999px', border: '1px solid #e5e7eb', width: '320px' }} />
            <button onClick={() => setPage('dashboard')} style={{ background: 'black', color: 'white', padding: '12px 22px', borderRadius: '999px', border: 'none', fontWeight: '700' }}>Dashboard →</button>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '18px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCat(cat)} style={{ padding: '8px 16px', borderRadius: '999px', border: '1px solid #e5e7eb', background: selectedCat === cat ? '#16a34a' : 'white', color: selectedCat === cat ? 'white' : '#374151', fontWeight: '600', fontSize: '13px' }}>{cat}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: '18px', marginTop: '28px' }}>
            {filtered.map(p => (
              <div key={p.id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
                {p.image_url ? <img src={p.image_url} style={{ width: '100%', height: '190px', objectFit: 'cover' }} /> : <div style={{ height: '190px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>📦</div>}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '999px', fontWeight: '700' }}>{p.category}</span>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>👤 {p.seller_name || 'Shopline'}</span>
                  </div>
                  <h3 style={{ fontWeight: '800', marginTop: '8px', fontSize: '15px' }}>{p.name}</h3>
                  <div style={{ marginTop: '8px', fontWeight: '900', fontSize: '18px', color: '#111827' }}>{formatKwacha(p.price)}</div>
                  <button onClick={() => orderWhatsApp(p)} style={{ width: '100%', background: '#25D366', color: 'white', border: 'none', padding: '12px', borderRadius: '12px', marginTop: '12px', fontWeight: '800', cursor: 'pointer' }}>💬 Order on WhatsApp</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', background: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontWeight: '900' }}>Dashboard <span style={{ color: '#16a34a' }}>• {formatKwacha(products.reduce((s,p)=>s+Number(p.price||0),0))} inventory</span></h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setPage('home')} style={{ padding: '10px 18px', borderRadius: '999px', border: '1px solid #e5e7eb', background: 'white' }}>🏠 Shop</button>
          <button onClick={() => setShowForm(!showForm)} style={{ background: 'black', color: 'white', padding: '10px 20px', borderRadius: '999px', border: 'none', fontWeight: '700' }}>+ Add Product</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={addProduct} style={{ background: 'white', padding: '18px', borderRadius: '16px', margin: '0 auto 20px', maxWidth: '1100px', display: 'grid', gridTemplateColumns: '1fr 120px 1fr 1fr 140px 100px', gap: '10px' }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Product name" required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }} />
          <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }} />
          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }} />
          <input value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="Seller name" style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }} />
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>{categories.filter(c=>c!=='All').map(c=><option key={c} value={c}>{c}</option>)}</select>
          <button type="submit" style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '800' }}>Save</button>
        </form>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', background: 'white', borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.6fr 0.7fr 0.8fr 80px', padding: '12px 16px', background: '#f9fafb', fontSize: '12px', fontWeight: '700', color: '#6b7280' }}>
          <div>PRODUCT</div><div>PRICE</div><div>CATEGORY</div><div>SELLER</div><div>ACTION</div>
        </div>
        {products.map(p => (
          <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.6fr 0.7fr 0.8fr 80px', padding: '12px 16px', borderTop: '1px solid #f3f4f6', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontWeight: '600' }}>{p.image_url && <img src={p.image_url} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />} {p.name}</div>
            <div style={{ fontWeight: '700' }}>{formatKwacha(p.price)}</div>
            <div>{p.category}</div>
            <div style={{ fontSize: '13px' }}>{p.seller_name || '-'}</div>
            <button onClick={() => deleteProduct(p.id)} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '12px' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}
export default App

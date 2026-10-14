'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// Supabase - your project
const supabase = createClient(
  'https://kfusttbmgbxklwnexdyk.supabase.co',
  'sb_publishable_XGyHpQhM0l2YLZPrQSqSSg_I0axJuXd'
)

export default function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([
    { id: 1, title: 'Tomatoes Fresh 5kg', price: 'K150', location: 'Lusaka', seller: 'Demo Seller' },
    { id: 2, title: 'Used Samsung Phone', price: 'K2,500', location: 'Ndola', seller: 'Chifuka' },
    { id: 3, title: 'Maize 50kg Bag', price: 'K400', location: 'Kabwe', seller: 'Farmer Joe' },
  ])
  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [showSell, setShowSell] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('shopline_user')
    if (saved) setUser(JSON.parse(saved))
    const savedProducts = localStorage.getItem('shopline_products')
    if (savedProducts) setProducts(JSON.parse(savedProducts))
  }, [])

  const handleLogin = async () => {
    if (!email ||!pass) return alert('Enter email and password')
    setLoading(true)
    try {
      // 1. Check if user exists
      const { data: existing } = await supabase
       .from('users')
       .select('*')
       .eq('email', email)
       .eq('password', pass)
       .single()

      if (existing) {
        localStorage.setItem('shopline_user', JSON.stringify(existing))
        setUser(existing)
        setShowLogin(false)
        setEmail('')
        setPass('')
        alert('Welcome back ' + existing.email + '!')
      } else {
        // 2. Create new user
        const { data: newUser, error } = await supabase
         .from('users')
         .insert([{ email: email, password: pass, name: email.split('@')[0] }])
         .select()
         .single()

        if (error) {
          // If email exists with different password
          if (error.code === '23505') {
            alert('Email already exists, wrong password')
          } else {
            alert('Error: ' + error.message)
          }
        } else {
          localStorage.setItem('shopline_user', JSON.stringify(newUser))
          setUser(newUser)
          setShowLogin(false)
          setEmail('')
          setPass('')
          alert('Account created! Welcome to Shopline Market!')
        }
      }
    } catch (e) {
      alert(e.message)
    }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('shopline_user')
    setUser(null)
  }

  const handleSell = () => {
    if (!newTitle ||!newPrice) return alert('Add title and price')
    if (!user) return alert('Please login first')
    const newProduct = {
      id: Date.now(),
      title: newTitle,
      price: newPrice.startsWith('K')? newPrice : 'K' + newPrice,
      location: newLocation || 'Zambia',
      seller: user.email
    }
    const updated = [newProduct,...products]
    setProducts(updated)
    localStorage.setItem('shopline_products', JSON.stringify(updated))
    setNewTitle('')
    setNewPrice('')
    setNewLocation('')
    setShowSell(false)
    alert('Product listed! Free on Shopline Market')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', fontFamily: 'Arial' }}>
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 }}>
        <b style={{ color: '#16a34a', fontSize: '18px' }}>SHOPLINE MARKET</b>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {user? (
            <>
              <span style={{ fontSize: '11px', maxWidth: '100px', overflow: 'hidden' }}>{user.email}</span>
              <button onClick={() => setShowSell(true)} style={{ background: '#16a34a', color: '#fff', padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '13px' }}>+ Sell Free</button>
              <button onClick={handleLogout} style={{ background: '#f3f3f3', padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '13px' }}>Log Out</button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{ background: '#16a34a', color: '#fff', padding: '7px 16px', borderRadius: '8px', border: 'none' }}>Log In</button>
          )}
        </div>
      </header>

      {/* BANNER */}
      <div style={{ padding: '16px', background: '#fff', margin: '10px', borderRadius: '12px' }}>
        <h2 style={{ margin: 0, fontSize: '16px' }}>{user? `Welcome ${user.name || user.email} 👋` : 'Zambia\'s Free Marketplace'}</h2>
        <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#666' }}>{user? 'You can now sell anything for FREE - no commission' : 'Log in to start buying & selling free'}</p>
      </div>

      {/* PRODUCTS */}
      <div style={{ padding: '0 10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {products.map(p => (
          <div key={p.id} style={{ background: '#fff', borderRadius: '12px', padding: '10px', border: '1px solid #eee' }}>
            <div style={{ background: '#e5f8e5', height: '80px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#16a34a' }}>IMAGE</div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '8px' }}>{p.title}</div>
            <div style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '14px', marginTop: '4px' }}>{p.price}</div>
            <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{p.location} • {p.seller.split('@')[0]}</div>
            <button style={{ width: '100%', marginTop: '8px', padding: '6px', background: '#111', color: '#fff', borderRadius: '6px', border: 'none', fontSize: '12px' }}>Contact Seller</button>
          </div>
        ))}
      </div>

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', width: '100%', maxWidth: '340px' }}>
            <h3 style={{ margin: 0 }}>Log In / Sign Up</h3>
            <p style={{ fontSize: '12px', color: '#666' }}>New email = auto creates account</p>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email - e.g. chifuka@gmail.com" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '12px', boxSizing: 'border-box' }} />
            <input value={pass} onChange={e => setPass(e.target.value)} type="password" placeholder="Password" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '10px', boxSizing: 'border-box' }} />
            <button onClick={handleLogin} disabled={loading} style={{ width: '100%', marginTop: '12px', padding: '12px', background: '#16a34a', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>{loading? 'Loading...' : 'Log In / Create Account'}</button>
            <button onClick={() => setShowLogin(false)} style={{ width: '100%', marginTop: '8px', padding: '10px', background: '#f3f3f3', borderRadius: '8px', border: 'none' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* SELL MODAL */}
      {showSell && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', width: '100%', maxWidth: '340px' }}>
            <h3 style={{ margin: 0 }}>Sell Free on Shopline</h3>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="What are you selling? e.g. Tomatoes" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '12px', boxSizing: 'border-box' }} />
            <input value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Price e.g. 150" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '10px', boxSizing: 'border-box' }} />
            <input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="Location e.g. Lusaka" style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', marginTop: '10px', boxSizing: 'border-box' }} />
            <button onClick={handleSell} style={{ width: '100%', marginTop: '12px', padding: '12px', background: '#16a34a', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>List Product FREE</button>
            <button onClick={() => setShowSell(false)} style={{ width: '100%', marginTop: '8px', padding: '10px', background: '#f3f3f3', borderRadius: '8px', border: 'none' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ height: '80px' }}></div>
    </div>
  )
    }

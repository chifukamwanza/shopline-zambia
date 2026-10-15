'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kfusttbmgbxklwnexdyk.supabase.co',
  'sb_publishable_XGyHpQhM0l2YLZPrQSqSSg_I0axJuXd'
)

export default function App() {
  const [user, setUser] = useState(null)
  const [contact, setContact] = useState('') // email OR phone
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false) // eye toggle
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
    if (!contact ||!pass) return alert('Enter email/phone and password')
    setLoading(true)
    try {
      const isPhone =!contact.includes('@')
      const field = isPhone? 'phone' : 'email'

      // 1. Check if user exists
      let query = supabase.from('users').select('*').eq('password', pass)
      if (isPhone) query = query.eq('phone', contact)
      else query = query.eq('email', contact)

      const { data: existing } = await query.single()

      if (existing) {
        localStorage.setItem('shopline_user', JSON.stringify(existing))
        setUser(existing)
        setShowLogin(false)
        setContact('')
        setPass('')
        alert('Welcome back ' + (existing.email || existing.phone) + '!')
      } else {
        // 2. Create new user
        const newData = isPhone
         ? { phone: contact, password: pass, name: contact }
          : { email: contact, password: pass, name: contact.split('@')[0] }

        const { data: newUser, error } = await supabase
         .from('users')
         .insert([newData])
         .select()
         .single()

        if (error) {
          if (error.code === '23505') {
            alert('Account exists, wrong password')
          } else {
            alert('Error: ' + error.message)
          }
        } else {
          localStorage.setItem('shopline_user', JSON.stringify(newUser))
          setUser(newUser)
          setShowLogin(false)
          setContact('')
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
      seller: user.email || user.phone
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
              <span style={{ fontSize: '12px' }}>{user.email || user.phone}</span>
              <button onClick={() => setShowSell(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px' }}>+ Sell Free</button>
              <button onClick={handleLogout} style={{ background: '#eee', border: 'none', padding: '8px 12px', borderRadius: '8px' }}>Logout</button>
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px' }}>Log In</button>
          )}
        </div>
      </header>

      {/* LOGIN MODAL - NEW WITH PHONE + EYE */}
      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ margin: 0 }}>Log In / Sign Up</h2>
            <p style={{ margin: 0, color: '#666', fontSize: '13px' }}>New email or phone = auto creates account</p>

            <input
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="Email or Phone - e.g. chifuka@gmail.com or 0977123456"
              style={{ padding: '14px', borderRadius: '12px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
            />

            <div style={{ position: 'relative', width: '100%' }}>
              <input
                value={pass}
                onChange={e => setPass(e.target.value)}
                type={showPass? 'text' : 'password'}
                placeholder="Password"
                style={{ padding: '14px', paddingRight: '45px', borderRadius: '12px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
              />
              <span
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '20px', userSelect: 'none' }}
              >{showPass? '🙈' : '👁️'}</span>
            </div>

            <button onClick={handleLogin} disabled={loading} style={{ background: '#16a34a', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold' }}>
              {loading? 'Please wait...' : 'Log In / Create Account'}
            </button>

            <button onClick={() => setShowLogin(false)} style={{ background: '#f3f4f6', padding: '14px', borderRadius: '12px', border: 'none' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
        {products.map(p => (
          <div key={p.id} style={{ background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #eee' }}>
            <div style={{ background: '#dcfce7', height: '100px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: 'bold' }}>IMAGE</div>
            <div style={{ marginTop: '8px', fontWeight: 'bold', fontSize: '14px' }}>{p.title}</div>
            <div style={{ color: '#16a34a', fontWeight: 'bold' }}>{p.price}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{p.location} • {p.seller}</div>
          </div>
        ))}
      </div>

      {/* SELL MODAL */}
      {showSell && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ margin: 0 }}>Sell Free</h2>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Product title" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Price e.g. 150" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="Location e.g. Chipata" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
            <button onClick={handleSell} style={{ background: '#16a34a', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none' }}>Post</button>
            <button onClick={() => setShowSell(false)} style={{ background: '#eee', padding: '12px', borderRadius: '8px', border: 'none' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
              }

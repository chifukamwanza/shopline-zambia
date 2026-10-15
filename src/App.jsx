'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kfusttbmgbxklwnexdyk.supabase.co',
  'sb_publishable_XGyHpQhM0l2YLZPrQSqSSg_I0axJuXd'
)

export default function App() {
  const [user, setUser] = useState(null)
  const [contact, setContact] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showSell, setShowSell] = useState(false)
  const [loading, setLoading] = useState(false)

  const [products, setProducts] = useState([
    { id: 1, title: 'Tomatoes Fresh 5kg', price: 'K150', location: 'Lusaka', seller: 'Demo Seller' },
    { id: 2, title: 'Used Samsung Phone', price: 'K2,500', location: 'Ndola', seller: 'Chifuka' },
    { id: 3, title: 'Maize 50kg Bag', price: 'K400', location: 'Kabwe', seller: 'Farmer Joe' },
  ])

  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newLocation, setNewLocation] = useState('')

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
      let query = supabase.from('users').select('*').eq('password', pass)
      if (isPhone) query = query.eq('phone', contact)
      else query = query.eq('email', contact)
      const { data: existing } = await query.single()
      if (existing) {
        localStorage.setItem('shopline_user', JSON.stringify(existing))
        setUser(existing)
        setShowLogin(false)
        setContact(''); setPass('')
      } else {
        const newData = isPhone? { phone: contact, password: pass, name: contact } : { email: contact, password: pass, name: contact.split('@')[0] }
        const { data: newUser, error } = await supabase.from('users').insert([newData]).select().single()
        if (error) alert('Error: ' + error.message)
        else {
          localStorage.setItem('shopline_user', JSON.stringify(newUser))
          setUser(newUser)
          setShowLogin(false)
          setContact(''); setPass('')
        }
      }
    } catch (e) { alert(e.message) }
    setLoading(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('shopline_user')
    setUser(null)
    setShowProfile(false)
  }

  const handleSell = () => {
    if (!newTitle ||!newPrice) return alert('Add title and price')
    if (!user) return alert('Please login first')
    const newProduct = { id: Date.now(), title: newTitle, price: newPrice.startsWith('K')? newPrice : 'K' + newPrice, location: newLocation || 'Zambia', seller: user.email || user.phone }
    const updated = [newProduct,...products]
    setProducts(updated)
    localStorage.setItem('shopline_products', JSON.stringify(updated))
    setNewTitle(''); setNewPrice(''); setNewLocation(''); setShowSell(false)
  }

  const initial = user? (user.email || user.phone || 'U').charAt(0).toUpperCase() : 'U'

  return (
    <div style={{ minHeight: '100vh', background: '#f2f2f2', fontFamily: 'Arial, sans-serif' }}>

      {/* HEADER - MOBILE FIT 100% */}
      <header style={{ background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px' }}>
          <div style={{ lineHeight: '15px' }}>
            <div style={{ color: '#16a34a', fontWeight: '900', fontSize: '16px' }}>SHOPLINE</div>
            <div style={{ color: '#16a34a', fontWeight: '900', fontSize: '16px' }}>MARKET</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user? (
              <>
                <button onClick={() => setShowSell(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '11px 16px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px' }}>+ Sell Free</button>
                <div onClick={() => setShowProfile(true)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>{initial}</div>
              </>
            ) : (
              <button onClick={() => setShowLogin(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '11px 18px', borderRadius: '12px', fontWeight: 'bold' }}>Log In</button>
            )}
          </div>
        </div>
      </header>

      {/* PROFILE MODAL */}
      {showProfile && user && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 30 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '420px', borderRadius: '20px 20px 0 0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ width: '40px', height: '5px', background: '#ddd', borderRadius: '10px', alignSelf: 'center' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>{initial}</div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{user.name || 'User'}</div>
                <div style={{ fontSize: '13px', color: '#555', wordBreak: 'break-all' }}>{user.email || user.phone}</div>
              </div>
            </div>
            <div style={{ background: '#f9f9f9', padding: '12px', borderRadius: '12px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div>📦 My listings: {products.filter(p => p.seller === (user.email || user.phone)).length}</div>
              <div>📍 Zambia</div>
            </div>
            <button onClick={handleLogout} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>Logout</button>
            <button onClick={() => setShowProfile(false)} style={{ background: '#111', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>Close</button>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ margin: 0 }}>Log In / Sign Up</h2>
            <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>Email or phone = auto creates account</p>
            <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Email or Phone e.g. 0977..." style={{ padding: '14px', borderRadius: '12px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }} />
            <div style={{ position: 'relative', width: '100%' }}>
              <input value={pass} onChange={e => setPass(e.target.value)} type={showPass? 'text' : 'password'} placeholder="Password" style={{ padding: '14px', paddingRight: '45px', borderRadius: '12px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }} />
              <span onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '20px' }}>{showPass? '🙈' : '👁️'}</span>
            </div>
            <button onClick={handleLogin} disabled={loading} style={{ background: '#16a34a', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold' }}>{loading? 'Wait...' : 'Log In / Create Account'}</button>
            <button onClick={() => setShowLogin(false)} style={{ background: '#f3f4f6', padding: '14px', borderRadius: '12px', border: 'none' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', maxWidth: '600px', margin: '0 auto' }}>
        {products.map(p => (
          <div key={p.id} style={{ background: '#fff', padding: '10px', borderRadius: '14px', border: '1px solid #eee' }}>
            <div style={{ background: '#dcfce7', height: '110px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', fontWeight: 'bold' }}>IMAGE</div>
            <div style={{ marginTop: '8px', fontWeight: 'bold', fontSize: '13px', height: '28px', overflow: 'hidden' }}>{p.title}</div>
            <div style={{ color: '#16a34a', fontWeight: 'bold' }}>{p.price}</div>
            <div style={{ fontSize: '11px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.location} • {p.seller}</div>
          </div>
        ))}
      </div>

      {/* SELL MODAL - ADD SPACE */}
      {showSell && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, padding: '16px' }}>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ margin: 0 }}>Add Product - Sell Free</h2>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="What are you selling?" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="Price e.g. 150" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
            <input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="Location e.g. Chipata" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }} />
            <button onClick={handleSell} style={{ background: '#16a34a', color: '#fff', padding: '14px', borderRadius: '10px', border: 'none', fontWeight: 'bold' }}>Post Now - Free</button>
            <button onClick={() => setShowSell(false)} style={{ background: '#eee', padding: '12px', borderRadius: '8px', border: 'none' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
          }

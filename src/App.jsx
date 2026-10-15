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
      const loginValue = contact.trim()

      // Try to find existing user
      let found = null
      if (isPhone) {
        const { data } = await supabase.from('users').select('*').eq('phone', loginValue).eq('password', pass).maybeSingle()
        if (data) found = data
        else {
          const { data: data2 } = await supabase.from('users').select('*').eq('email', loginValue + '@phone.shopline').eq('password', pass).maybeSingle()
          if (data2) found = data2
        }
      } else {
        const { data } = await supabase.from('users').select('*').eq('email', loginValue).eq('password', pass).maybeSingle()
        if (data) found = data
      }

      if (found) {
        localStorage.setItem('shopline_user', JSON.stringify(found))
        setUser(found)
        setShowLogin(false)
        setContact(''); setPass('')
      } else {
        // Create new user - FIXED FOR PHONE
        const newData = isPhone
         ? { phone: loginValue, email: loginValue + '@phone.shopline', password: pass, name: loginValue }
          : { email: loginValue, phone: loginValue, password: pass, name: loginValue.split('@')[0] }

        const { data: newUser, error } = await supabase.from('users').insert([newData]).select().single()
        if (error) {
          alert('Error: ' + error.message)
        } else {
          localStorage.setItem('shopline_user', JSON.stringify(newUser))
          setUser(newUser)
          setShowLogin(false)
          setContact(''); setPass('')
        }
      }
    } catch (e) {
      alert('Something wrong: ' + e.message)
    }
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
    const newProduct = {
      id: Date.now(),
      title: newTitle,
      price: newPrice.startsWith('K')? newPrice : 'K' + newPrice,
      location: newLocation || 'Chipata',
      seller: user.email || user.phone
    }
    const updated = [newProduct,...products]
    setProducts(updated)
    localStorage.setItem('shopline_products', JSON.stringify(updated))
    setNewTitle(''); setNewPrice(''); setNewLocation(''); setShowSell(false)
  }

  const initial = user? (user.email || user.phone || 'U').charAt(0).toUpperCase() : 'U'

  return (
    <div style={{ minHeight: '100vh', background: '#f2f2f2', fontFamily: 'Arial, sans-serif' }}>

      {/* HEADER - MOBILE FIT */}
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
          <div

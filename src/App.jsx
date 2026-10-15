import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kfusttbmgbxklwnexdyk.supabase.co',
  'sb_publishable_XGyHpQhM0l2YLZPrQSqSSg_I0axJuXd'
)

export default function App() {
  const categories = [
    { id: 'All', label: 'All', icon: '✨' },
    { id: 'Trending', label: 'Trending', icon: '🔥' },
    { id: 'Phones', label: 'Phones', icon: '📱' },
    { id: 'Laptops', label: 'Laptops', icon: '💻' },
    { id: 'Electronics', label: 'Electronics', icon: '🔌' },
    { id: 'Fashion Men', label: 'Men Fashion', icon: '👕' },
    { id: 'Fashion Women', label: 'Women Fashion', icon: '👗' },
    { id: 'Shoes', label: 'Shoes', icon: '👟' },
    { id: 'Beauty', label: 'Beauty', icon: '💄' },
    { id: 'Home', label: 'Home & Garden', icon: '🏠' },
    { id: 'Vehicles', label: 'Vehicles', icon: '🚗' },
    { id: 'Property', label: 'Property', icon: '🏘️' },
    { id: 'Food', label: 'Food', icon: '🍅' },
    { id: 'Livestock', label: 'Livestock', icon: '🐄' },
    { id: 'Agriculture', label: 'Agriculture', icon: '🌾' },
    { id: 'Services', label: 'Services', icon: '🛠️' },
    { id: 'Jobs', label: 'Jobs', icon: '💼' },
    { id: 'Kids', label: 'Babies & Kids', icon: '🧒' },
    { id: 'Sports', label: 'Sports', icon: '⚽' },
    { id: 'Books', label: 'Books', icon: '📚' },
    { id: 'Pets', label: 'Pets', icon: '🐶' },
  ]

  const [user, setUser] = useState(null)
  const [contact, setContact] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showSell, setShowSell] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cat, setCat] = useState('All')
  const [products, setProducts] = useState([
    { id: 1, title: 'iPhone 14 Pro Max 256GB', price: 'K12,500', location: 'Lusaka', seller: 'Demo', image: '', cat: 'Phones' },
    { id: 2, title: 'Nike Air Max Shoes', price: 'K850', location: 'Ndola', seller: 'Sneaker Hub', image: '', cat: 'Shoes' },
    { id: 3, title: 'Fresh Tomatoes 10kg', price: 'K200', location: 'Chipata', seller: 'Farmer', image: '', cat: 'Food' },
    { id: 4, title: 'Toyota Corolla 2015', price: 'K85,000', location: 'Lusaka', seller: 'Auto Deal', image: '', cat: 'Vehicles' },
  ])
  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newLocation, setNewLocation] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newCat, setNewCat] = useState('Phones')
  const [showChat, setShowChat] = useState(false)
  const [chatProduct, setChatProduct] = useState(null)
  const [chatMsg, setChatMsg] = useState('')
  const [chats, setChats] = useState({})

  useEffect(() => {
    const s = localStorage.getItem('shopline_user')
    if (s) setUser(JSON.parse(s))
    const p = localStorage.getItem('shopline_products')
    if (p) setProducts(JSON.parse(p))
    const c = localStorage.getItem('shopline_chats')
    if (c) setChats(JSON.parse(c))
  }, [])

  const getInitial = () => {
    if (!user) return 'C'
    let n = user.name || ''
    let letters = n.replace(/[^A-Za-z]/g, '')
    if (letters.length > 0) return letters[0].toUpperCase()
    return 'C'
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const r = new FileReader()
    r.onload = () => setNewImage(r.result)
    r.readAsDataURL(file)
  }

  const handleLogin = async () => {
    if (!contact ||!pass) return alert('Enter email/phone')
    setLoading(true)
    try {
      const isPhone =!contact.includes('@')
      const v = contact.trim()
      let found = null
      if (isPhone) {
        const { data } = await supabase.from('users').select('*').eq('phone', v).eq('password', pass).maybeSingle()
        if (data) found = data
        else {
          const { data: d2 } = await supabase.from('users').select('*').eq('email', v + '@phone.shopline').eq('password', pass).maybeSingle()
          if (d2) found = d2
        }
      } else {
        const { data } = await supabase.from('users').select('*').eq('email', v).eq('password', pass).maybeSingle()
        if (data) found = data
      }
      if (found) {
        localStorage.setItem('shopline_user', JSON.stringify(found))
        setUser(found)
        setShowLogin(false)
        setContact('')
        setPass('')
      } else {
        const nd = isPhone? { phone: v, email: v + '@phone.shopline', password: pass, name: 'Chifuka' } : { email: v, phone: v, password: pass, name: v.split('@')[0] }
        const { data: nu, error } = await supabase.from('users').insert([nd]).select().single()
        if (error) alert(error.message)
        else {
          localStorage.setItem('shopline_user', JSON.stringify(nu))
          setUser(nu)
          setShowLogin(false)
          setContact('')
          setPass('')
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
    setShowProfile(false)
  }

  const handleSell = () => {
    if (!newTitle ||!newPrice) return alert('Add title and price')
    if (!user) return alert('Login first')
    const np = { id: Date.now(), title: newTitle, price: newPrice.startsWith('K')? newPrice : 'K' + newPrice, location: newLocation || 'Lusaka', seller: user.email || user.phone, image: newImage, cat: newCat }
    const up = [np,...products]
    setProducts(up)
    localStorage.setItem('shopline_products', JSON.stringify(up))
    setNewTitle('')
    setNewPrice('')
    setNewLocation('')
    setNewImage('')
    setShowSell(false)
  }

  const openChat = (p) => {
    if (!user) return alert('Login to chat')
    setChatProduct(p)
    setShowChat(true)
  }

  const sendChat = () => {
    if (!chatMsg.trim()) return
    const id = chatProduct.id
    const all = {...chats }
    if (!all[id]) all[id] = []
    all[id].push({ from: user.email || user.phone, text: chatMsg, time: new Date().toLocaleTimeString() })
    setChats(all)
    localStorage.setItem('shopline_chats', JSON.stringify(all))
    setChatMsg('')
  }

  const initial = getInitial()
  const filtered = cat === 'All'? products : cat === 'Trending'? products.slice(0, 6) : products.filter(p => p.cat === cat)
  const userName = user? (user.name || 'Chifuka') : 'Friend'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Arial' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px' }}>
          <div style={{ lineHeight: '15px' }}>
            <div style={{ color: '#16a34a', fontWeight: 900 }}>SHOPLINE</div>
            <div style={{ color: '#16a34a', fontWeight: 900 }}>MARKET</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {user? (
              <>
                <button onClick={() => setShowSell(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '11px 16px', borderRadius: '12px', fontWeight: 'bold' }}>+ Sell Free</button>
                <div onClick={() => setShowProfile(true)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer' }}>{initial}</div>
              </>
            ) : (
              <button onClick={() => setShowLogin(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '11px 18px', borderRadius: '12px', fontWeight: 'bold' }}>Log In</button>
            )}
          </div>
        </div>
      </header>

      <div style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', color: '#fff', padding: '16px 12px', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{user? `Welcome back, ${userName}! 👋` : 'Welcome

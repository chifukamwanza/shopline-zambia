import { useState, useEffect } from 'react'
import ProductCard from './components/ProductCard'
import AuthModal from './components/AuthModal'
import ProfileModal from './components/ProfileModal'
import VerificationModal from './components/VerificationModal'

const CATS = ['All','Phones','Clothes','Shoes','Bags','Beauty','Electronics','Home','Cars','Property','Jobs','Services','Food','Kids','Other']
const SELL_CATS = ['Phones','Clothes','Shoes','Bags','Beauty','Electronics','Home','Cars','Property','Jobs','Services','Food','Kids','Other']
const COUNTRIES = ['Zambia','USA','Afghanistan','Albania','Algeria','Angola','Argentina','Australia','Austria','Belgium','Benin','Botswana','Brazil','Burkina Faso','Burundi','Cameroon','Canada','Chad','Chile','China','Colombia','Congo','Croatia','Cyprus','Denmark','Ethiopia','France','Germany','Ghana','Greece','India','Indonesia','Italy','Kenya','Malawi','Mozambique','Namibia','Nigeria','Portugal','South Africa','Spain','Tanzania','Uganda','United Kingdom','Zimbabwe']

const safeStorage = {
  read: (key, fallback = null) => {
    try {
      const value = localStorage.getItem(key)
      if (value === null) return fallback
      try { return JSON.parse(value) } catch { return value }
    } catch {
      return fallback
    }
  },
  write: (key, value) => {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  remove: (key) => {
    try { localStorage.removeItem(key) } catch {}
  }
}

const normalizePhone = (value = '') => {
  const digits = String(value).replace(/\D/g, '')
  if (!digits) return ''
  if (digits.startsWith('0')) return `260${digits.slice(1)}`
  if (digits.startsWith('260')) return digits
  return digits
}

const isEmail = (value = '') => /\S+@\S+\.\S+/.test(String(value).trim())
const getIdentifierType = (value = '') => (isEmail(value) ? 'email' : 'whatsapp')
const defaultProducts = [
  {
    id: 1,
    title: 'Tekno spark 20',
    price: '2,800',
    country: 'Zambia',
    location: 'Chipata',
    category: 'Phones',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd',
    owner: 'demo@z.com',
    phone: '260977000111',
    description: 'Unlocked smartphone in excellent condition.',
    verifiedSeller: true
  },
  {
    id: 2,
    title: 'Bluetooth speaker',
    price: '550',
    country: 'Zambia',
    location: 'Lusaka',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',
    owner: 'demo2@gmail.com',
    phone: '260965222333',
    description: 'Portable speaker with long battery life.',
    verifiedSeller: true
  },
  {
    id: 3,
    title: 'Chitenge dress',
    price: '420',
    country: 'Zambia',
    location: 'Livingstone',
    category: 'Clothes',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b',
    owner: 'fashion@shopline.com',
    phone: '260978111222',
    description: 'Traditional African print dress in stock.',
    verifiedSeller: true
  }
]

export default function App() {
  const [products, setProducts] = useState(() => safeStorage.read('shopline_products', defaultProducts))
  const [accounts, setAccounts] = useState(() => safeStorage.read('shopline_accounts', []))
  const [user, setUser] = useState(() => safeStorage.read('shopline_user', null))
  const [showSell, setShowSell] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [editing, setEditing] = useState(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState('')
  const [sellCat, setSellCat] = useState('Phones')
  const [country, setCountry] = useState('Zambia')
  const [town, setTown] = useState('Chipata')
  const [image, setImage] = useState('')
  const [imgPreview, setImgPreview] = useState('')
  const [contact, setContact] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editCountry, setEditCountry] = useState('Zambia')
  const [editTown, setEditTown] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editPic, setEditPic] = useState('')
  const [verificationTarget, setVerificationTarget] = useState('')
  const [verificationMethod, setVerificationMethod] = useState('email')
  const [verificationCode, setVerificationCode] = useState('')
  const [expectedCode, setExpectedCode] = useState('')

  useEffect(() => {
    safeStorage.write('shopline_products', products)
  }, [products])

  useEffect(() => {
    if (user) {
      safeStorage.write('shopline_user', user)
    } else {
      safeStorage.remove('shopline_user')
    }
  }, [user])

  useEffect(() => {
    safeStorage.write('shopline_accounts', accounts)
  }, [accounts])

  const refreshProfile = (nextUser) => {
    setUser(nextUser)
    setAccounts(prev => prev.map(account => account.id === nextUser.id ? { ...account, ...nextUser } : account))
  }

  const openVerification = (target, method = 'email') => {
    const code = String(Math.floor(100000 + Math.random() * 900000))
    safeStorage.write('shopline_verification', { target, method, code })
    setVerificationTarget(target || '')
    setVerificationMethod(method)
    setExpectedCode(code)
    setVerificationCode('')
    setShowVerification(true)
  }

  const resetSell = () => {
    setTitle('')
    setDesc('')
    setPrice('')
    setSellCat('Phones')
    setCountry('Zambia')
    setTown('Chipata')
    setImage('')
    setImgPreview('')
    setEditing(null)
    setShowSell(false)
  }

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      alert('Image must be under 3MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImage(reader.result)
      setImgPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleAuth = () => {
    if (!contact || !pass) {
      alert('Enter your email or WhatsApp number and password.')
      return
    }

    setLoading(true)

    const trimmed = contact.trim()
    const type = getIdentifierType(trimmed)
    const normalizedContact = type === 'email' ? trimmed.toLowerCase() : normalizePhone(trimmed)

    const existingIndex = accounts.findIndex(account => {
      if (type === 'email') {
        return (account.email || '').toLowerCase() === normalizedContact
      }
      return (account.phone || '') === normalizedContact
    })

    if (authMode === 'login') {
      if (existingIndex === -1) {
        alert('No account found. Please sign up first.')
        setLoading(false)
        return
      }

      const account = accounts[existingIndex]
      if (account.password !== pass) {
        alert('Incorrect password.')
        setLoading(false)
        return
      }

      const activeUser = {
        ...account,
        verified: Boolean(account.verified),
        verificationMethod: account.verificationMethod || type,
        verificationTarget: account.verificationTarget || normalizedContact,
        email: account.email || (type === 'email' ? normalizedContact : ''),
        phone: account.phone || (type === 'whatsapp' ? normalizedContact : '')
      }

      setUser(activeUser)
      setShowAuth(false)
      setContact('')
      setPass('')
      setLoading(false)

      if (!activeUser.verified) {
        openVerification(activeUser.verificationTarget || normalizedContact, activeUser.verificationMethod || type)
      }
      return
    }

    if (existingIndex !== -1) {
      alert('An account with this contact already exists. Please log in instead.')
      setLoading(false)
      return
    }

    const newAccount = {
      id: Date.now(),
      name: type === 'email' ? normalizedContact.split('@')[0] : normalizedContact,
      email: type === 'email' ? normalizedContact : '',
      phone: type === 'whatsapp' ? normalizedContact : '',
      password: pass,
      bio: 'New seller on Shopline',
      country: 'Zambia',
      town: 'Chipata',
      pic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      verified: false,
      verificationMethod: type,
      verificationTarget: normalizedContact
    }

    setAccounts(prev => [newAccount, ...prev])
    setUser(newAccount)
    setShowAuth(false)
    setContact('')
    setPass('')
    setLoading(false)
    openVerification(normalizedContact, type)
  }

  const handleVerificationSubmit = () => {
    if (!expectedCode || !verificationCode) {
      alert('Please enter the verification code.')
      return
    }

    if (String(verificationCode).trim() !== String(expectedCode).trim()) {
      alert('Incorrect code. Please check the code again.')
      return
    }

    const updatedUser = {
      ...user,
      verified: true,
      verificationMethod,
      verificationTarget,
      verifiedAt: new Date().toISOString()
    }

    setAccounts(prev => prev.map(account => account.id === updatedUser.id ? { ...account, ...updatedUser, verified: true } : account))
    setUser(updatedUser)
    setShowVerification(false)
    setVerificationCode('')
    setExpectedCode('')
    alert('Account verified successfully. You can now sell.')
  }

  const handlePost = () => {
    if (!title || !price) {
      alert('Add a title and price before posting.')
      return
    }

    if (!user) {
      setShowAuth(true)
      return
    }

    if (!user.verified) {
      setVerificationTarget(user.verificationTarget || user.email || user.phone || '')
      setVerificationMethod(user.verificationMethod || 'email')
      setShowVerification(true)
      return
    }

    const nextProduct = {
      id: editing ? editing.id : Date.now(),
      title,
      description: desc,
      price: price.toString().replace(/[^\d.]/g, ''),
      category: sellCat,
      country: country || 'Zambia',
      location: town || 'Chipata',
      image: imgPreview || image || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36',
      owner: user.email || user.phone || 'seller@shopline.app',
      phone: user.phone || '260977000000',
      verifiedSeller: true,
      sellerName: user.name || 'Verified seller'
    }

    if (editing) {
      setProducts(prev => prev.map(product => product.id === editing.id ? { ...product, ...nextProduct } : product))
    } else {
      setProducts(prev => [nextProduct, ...prev])
    }

    resetSell()
  }

  const onEdit = (product) => {
    setEditing(product)
    setTitle(product.title)
    setDesc(product.description || '')
    setPrice(product.price.toString().replace(/K|,/g, ''))
    setSellCat(product.category || 'Other')
    setCountry(product.country || 'Zambia')
    setTown(product.location || 'Chipata')
    setImage(product.image || '')
    setImgPreview(product.image || '')
    setShowSell(true)
  }

  const onDelete = (product) => {
    if (!window.confirm(`Delete ${product.title}?`)) return
    setProducts(prev => prev.filter(item => item.id !== product.id))
  }

  const openProfile = () => {
    if (!user) {
      setShowAuth(true)
      return
    }

    setEditName(user.name || '')
    setEditBio(user.bio || '')
    setEditCountry(user.country || 'Zambia')
    setEditTown(user.town || '')
    setEditPhone(user.phone || '')
    setEditPic(user.pic || '')
    setShowProfile(true)
  }

  const saveProfile = () => {
    if (!user) return

    const nextUser = {
      ...user,
      name: editName || user.name || 'Shopline User',
      bio: editBio || '',
      country: editCountry || 'Zambia',
      town: editTown || '',
      phone: editPhone || user.phone || '',
      pic: editPic || user.pic || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
    }

    refreshProfile(nextUser)
    setShowProfile(false)
  }

  const handleLogout = () => {
    if (!window.confirm('Log out?')) return
    setUser(null)
    setShowProfile(false)
  }

  const filtered = products.filter(item => {
    const haystack = `${item.title} ${item.description || ''} ${item.category || ''}`.toLowerCase()
    const matchesSearch = haystack.includes(search.toLowerCase())
    const matchesCategory = cat === 'All' || item.category === cat || item.title.toLowerCase().includes(cat.toLowerCase())
    return matchesSearch && matchesCategory
  })

  const verificationLabel = user?.verified
    ? (user.verificationMethod === 'whatsapp' ? 'Verified via WhatsApp' : 'Verified via Email')
    : 'Account not verified yet'

  return (
    <div style={{ minHeight: '100vh', background: '#f0f9f0', fontFamily: 'system-ui' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: '#fff', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 0 #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 900, fontSize: '20px', color: '#111' }}>
          <span style={{ background: '#22c55e', color: '#fff', width: '32px', height: '32px', borderRadius: '10px', display: 'grid', placeItems: 'center' }}>S</span>
          <span>Shopline Global</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => { setCat('All'); window.scrollTo(0, 0) }} style={{ background: '#f3f4f6', color: '#111', border: 'none', borderRadius: '20px', padding: '7px 16px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
            Home
          </button>
          <button onClick={() => {
            if (!user) { setShowAuth(true); return }
            if (!user.verified) {
              openVerification(user.verificationTarget || user.email || user.phone || '', user.verificationMethod || 'email')
              return
            }
            setShowSell(true)
          }} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '20px', padding: '7px 14px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>
            {user ? (user.verified ? 'Sell Now' : 'Verify to Sell') : 'Join to Sell'}
          </button>
          {user ? (
            <img onClick={openProfile} src={user.pic || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'} alt="profile" style={{ width: '34px', height: '34px', borderRadius: '50%', border: user.verified ? '2px solid #16a34a' : '2px solid #f59e0b', objectFit: 'cover', cursor: 'pointer' }} />
          ) : (
            <button onClick={() => setShowAuth(true)} style={{ background: '#111827', color: '#fff', border: 'none', borderRadius: '20px', padding: '7px 14px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}>
              Login
            </button>
          )}
        </div>
      </header>

      <div style={{ margin: '10px 12px', background: '#fff', borderRadius: '16px', padding: '14px', textAlign: 'center', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ fontSize: '16px', fontWeight: '900', color: '#111827' }}>Welcome to Shopline Global 🌍</div>
        <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px', lineHeight: '1.4' }}>
          The World's Open Market — Buy & Sell Anything, Anywhere.<br />
          <b>100% Free • Trusted • Instant WhatsApp & Email Verification</b>
        </div>
      </div>

      {user && (
        <div style={{ margin: '0 12px 10px', background: user.verified ? '#ecfdf5' : '#fff7ed', border: `1px solid ${user.verified ? '#a7f3d0' : '#fdba74'}`, borderRadius: '12px', padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#475569', fontWeight: '700' }}>Account status</div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#111827' }}>{verificationLabel}</div>
          </div>
          {!user.verified && (
            <button onClick={() => openVerification(user.verificationTarget || user.email || user.phone || '', user.verificationMethod || 'email')} style={{ background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 12px', fontWeight: '800', cursor: 'pointer' }}>
              Verify now
            </button>
          )}
        </div>
      )}

      <div style={{ padding: '0 14px' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products or categories..." style={{ width: '100%', padding: '12px 18px', borderRadius: '30px', border: '1.5px solid #d1d5db', background: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', padding: '12px 10px' }}>
        {CATS.map(category => (
          <button key={category} onClick={() => setCat(category)} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #e5e7eb', background: cat === category ? '#16a34a' : '#fff', color: cat === category ? '#fff' : '#111827', fontWeight: '700', cursor: 'pointer' }}>
            {category}
          </button>
        ))}
      </div>

      <div style={{ margin: '0 12px', border: '1.5px dashed #facc15', background: '#fffef0', borderRadius: '4px', padding: '8px', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>📍 Ad Space</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px' }}>
        {filtered.map(product => (
          <ProductCard key={product.id} pr={product} user={user} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>

      {showSell && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '420px', borderRadius: '20px', padding: '20px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={resetSell} style={{ position: 'absolute', right: '14px', top: '14px', width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #000', background: '#000', color: '#fff', fontWeight: '900', cursor: 'pointer' }}>×</button>
            <h3 style={{ margin: '0 0 14px', fontSize: '19px', fontWeight: '900' }}>{editing ? 'Edit Product' : '+ Sell Product'}</h3>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Product name" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e5e7eb', marginBottom: '10px', boxSizing: 'border-box' }} />
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" rows={2} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e5e7eb', marginBottom: '10px', resize: 'vertical', boxSizing: 'border-box' }} />
            <select value={sellCat} onChange={e => setSellCat(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #16a34a', marginBottom: '10px', background: '#f0fdf4', boxSizing: 'border-box' }}>
              {SELL_CATS.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select value={country} onChange={e => setCountry(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #2563eb', marginBottom: '10px', background: '#eff6ff', boxSizing: 'border-box' }}>
              {COUNTRIES.map(item => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price e.g. 2800" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e5e7eb', marginBottom: '10px', boxSizing: 'border-box' }} />
            <input value={town} onChange={e => setTown(e.target.value)} placeholder="Town e.g. Chipata" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #e5e7eb', marginBottom: '10px', boxSizing: 'border-box' }} />
            <div style={{ marginBottom: '14px' }}>
              {(imgPreview || image) && (
                <img src={imgPreview || image} alt="preview" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px', border: '2px solid #00b14f' }} />
              )}
              <label style={{ display: 'block', marginTop: '10px', background: '#eef2ff', padding: '10px 12px', borderRadius: '10px', color: '#111827', fontWeight: '800', textAlign: 'center', cursor: 'pointer' }}>
                Upload image
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <button onClick={handlePost} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: '900', fontSize: '16px', cursor: 'pointer' }}>
              {editing ? 'Update Product' : 'Post Product'}
            </button>
          </div>
        </div>
      )}

      {showAuth && (
        <AuthModal
          contact={contact}
          setContact={setContact}
          pass={pass}
          setPass={setPass}
          showPass={showPass}
          setShowPass={setShowPass}
          onLogin={handleAuth}
          onClose={() => setShowAuth(false)}
          loading={loading}
          authMode={authMode}
          setAuthMode={setAuthMode}
        />
      )}

      {showProfile && (
        <ProfileModal
          user={user}
          editName={editName}
          setEditName={setEditName}
          editBio={editBio}
          setEditBio={setEditBio}
          editCountry={editCountry}
          setEditCountry={setEditCountry}
          editTown={editTown}
          setEditTown={setEditTown}
          editPhone={editPhone}
          setEditPhone={setEditPhone}
          editPic={editPic}
          setEditPic={setEditPic}
          countries={COUNTRIES}
          onSave={saveProfile}
          onClose={() => setShowProfile(false)}
          onLogout={handleLogout}
          onVerify={() => openVerification(user?.verificationTarget || user?.email || user?.phone || '', user?.verificationMethod || 'email')}
          loading={loading}
        />
      )}

      {showVerification && (
        <VerificationModal
          target={verificationTarget}
          method={verificationMethod}
          code={verificationCode}
          setCode={setVerificationCode}
          onVerify={handleVerificationSubmit}
          onClose={() => setShowVerification(false)}
          expectedCode={expectedCode}
          user={user}
        />
      )}
    </div>
  )
}



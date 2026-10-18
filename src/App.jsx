import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import safeStorage from './safeStorage'

const cats = [
  { id: 'All', l: 'All', i: '★' },
  { id: 'Trending', l: 'Trending', i: '🔥' },
  { id: 'Phones', l: 'Phones', i: '📱' },
  { id: 'Laptops', l: 'Laptops', i: '💻' },
  { id: 'Electronics', l: 'Electronics', i: '🔌' },
  { id: 'Fashion Men', l: 'Men', i: '👕' },
  { id: 'Fashion Women', l: 'Women', i: '👗' },
  { id: 'Shoes', l: 'Shoes', i: '👟' },
  { id: 'Beauty', l: 'Beauty', i: '💄' },
  { id: 'Home', l: 'Home', i: '🏠' },
  { id: 'Vehicles', l: 'Vehicles', i: '🚗' },
  { id: 'Property', l: 'Property', i: '🏢' },
  { id: 'Food', l: 'Food', i: '🍎' },
  { id: 'Livestock', l: 'Livestock', i: '🐄' },
  { id: 'Farming', l: 'Farming', i: '🌾' },
  { id: 'Services', l: 'Services', i: '🔧' },
  { id: 'Jobs', l: 'Jobs', i: '💼' },
  { id: 'Kids', l: 'Kids', i: '👶' },
  { id: 'Sports', l: 'Sports', i: '⚽' },
  { id: 'Books', l: 'Books', i: '📚' },
  { id: 'Pets', l: 'Pets', i: '🐶' }
]

const countries = ['Zambia', 'Tanzania', 'Kenya', 'Uganda', 'Rwanda', 'Burundi', 'DRC', 'Malawi', 'Mozambique', 'Zimbabwe', 'South Africa', 'Botswana', 'Namibia', 'Angola', 'Nigeria', 'Ghana', 'Ethiopia', 'USA', 'UK', 'UAE', 'China', 'India']
const allCountriesFilter = ['All Countries', ...countries]

const buildAuthEmail = (contact) => {
  const trimmed = (contact || '').trim()
  if (!trimmed) return ''
  return trimmed.includes('@') ? trimmed : `${trimmed}@phone.shopline`
}

const mergeStoredProfile = (authUser, localProfile = {}) => {
  if (!authUser) return null

  const base = {
    id: authUser.id,
    email: authUser.email || localProfile.email || '',
    name: authUser.user_metadata?.full_name || localProfile.name || '',
    bio: localProfile.bio || '',
    userCountry: localProfile.userCountry || 'Zambia',
    town: localProfile.town || '',
    phone: localProfile.phone || '',
    pic: localProfile.pic || '',
    password: localProfile.password || ''
  }

  return base
}

export default function App() {
  const [user, setUser] = useState(() => safeStorage.read('shopline_user'))
  const [showLogin, setShowLogin] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showSell, setShowSell] = useState(false)
  const [contact, setContact] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [verifyInput, setVerifyInput] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [pendingUser, setPendingUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [editName, setEditName] = useState(user?.name || '')
  const [editBio, setEditBio] = useState(user?.bio || '')
  const [editCountry, setEditCountry] = useState(user?.userCountry || 'Zambia')
  const [editTown, setEditTown] = useState(user?.town || '')
  const [editPhone, setEditPhone] = useState(user?.phone || '')
  const [editPic, setEditPic] = useState(user?.pic || '')
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [country, setCountry] = useState('All Countries')
  const [t, setT] = useState('')
  const [d, setD] = useState('')
  const [p, setP] = useState('')
  const [loc, setLoc] = useState('')
  const [nc, setNc] = useState('Phones')
  const [nCountry, setNCountry] = useState('Zambia')
  const [img, setImg] = useState('')
  const [products, setProducts] = useState([
    { id: 1, title: 'iPhone 13 Pro', desc: 'Very clean 256GB', price: 'K8500', location: 'Lusaka', country: 'Zambia', cat: 'Phones', owner: 'test@test.com' },
    { id: 2, title: 'Toyota Hilux 2020', desc: 'Diesel low mileage', price: 'K185000', location: 'Ndola', country: 'Zambia', cat: 'Vehicles', owner: 'test@test.com' }
  ])

  useEffect(() => {
    if (user) {
      safeStorage.write('shopline_user', user)
    } else {
      safeStorage.remove('shopline_user')
    }
  }, [user])

  useEffect(() => {
    setEditName(user?.name || '')
    setEditBio(user?.bio || '')
    setEditCountry(user?.userCountry || 'Zambia')
    setEditTown(user?.town || '')
    setEditPhone(user?.phone || '')
    setEditPic(user?.pic || '')
  }, [user])

  const getI = () => {
    const pic = editPic || user?.pic
    if (pic) return ''
    return (editName || user?.name || 'C').charAt(0).toUpperCase()
  }

  const handleProfilePic = (e) => {
    const f = e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = (ev) => setEditPic(ev.target.result)
    reader.readAsDataURL(f)
  }

  const handleImg = (e) => {
    const f = e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = (ev) => setImg(ev.target.result)
    reader.readAsDataURL(f)
  }

  const syncLocalUser = (profile) => {
    const nextUser = { ...profile }
    safeStorage.write('shopline_user', nextUser)
    setUser(nextUser)
  }

  const login = async () => {
    if (!contact || !pass) return alert('Enter email/phone and password')

    setLoading(true)

    try {
      const normalized = contact.trim()
      const isPhone = !normalized.includes('@')
      const authEmail = buildAuthEmail(normalized)
      const localProfile = safeStorage.read('shopline_profiles', {})

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: pass
      })

      if (signInError) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: authEmail,
          password: pass,
          options: {
            data: {
              full_name: isPhone ? normalized : normalized.split('@')[0]
            }
          }
        })

        if (signUpError) throw signUpError

        const createdProfile = mergeStoredProfile(signUpData.user, {
          email: authEmail,
          name: isPhone ? normalized : normalized.split('@')[0],
          phone: isPhone ? normalized : '',
          userCountry: 'Zambia'
        })

        localProfile[authEmail] = createdProfile
        safeStorage.write('shopline_profiles', localProfile)

        const code = Math.floor(100000 + Math.random() * 900000).toString()
        setGeneratedCode(code)
        setPendingUser(createdProfile)
        setShowLogin(false)
        setShowVerify(true)
        setLoading(false)
        return
      }

      const profile = mergeStoredProfile(authData.user, localProfile[authEmail] || {})
      profile.phone = isPhone ? normalized : profile.phone || normalized
      profile.name = profile.name || (isPhone ? normalized : normalized.split('@')[0])

      localProfile[authEmail] = profile
      safeStorage.write('shopline_profiles', localProfile)
      syncLocalUser(profile)

      setEditName(profile.name || '')
      setEditBio(profile.bio || '')
      setEditCountry(profile.userCountry || 'Zambia')
      setEditTown(profile.town || '')
      setEditPhone(profile.phone || '')
      setEditPic(profile.pic || '')
      setShowLogin(false)
      setContact('')
      setPass('')
    } catch (e) {
      alert(e.message || 'Unable to login')
    } finally {
      setLoading(false)
    }
  }

  const confirmVerify = async () => {
    if (verifyInput !== generatedCode) {
      return alert('Wrong code. Your code: ' + generatedCode)
    }

    setLoading(true)
    try {
      const userProfile = pendingUser || user
      const merged = {
        ...userProfile,
        name: userProfile?.name || editName || 'Shopline User',
        bio: userProfile?.bio || editBio || '',
        userCountry: userProfile?.userCountry || editCountry || 'Zambia',
        town: userProfile?.town || editTown || '',
        phone: userProfile?.phone || editPhone || '',
        pic: userProfile?.pic || editPic || ''
      }

      const store = safeStorage.read('shopline_profiles', {})
      store[merged.email] = merged
      safeStorage.write('shopline_profiles', store)
      syncLocalUser(merged)

      await supabase.from('users').upsert([
        {
          email: merged.email,
          name: merged.name,
          bio: merged.bio,
          phone: merged.phone,
          userCountry: merged.userCountry,
          town: merged.town,
          pic: merged.pic,
          verified: true
        }
      ])

      setShowVerify(false)
      setVerifyInput('')
      setPendingUser(null)
      setContact('')
      setPass('')
    } catch (e) {
      alert(e.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async () => {
    if (!editName) return alert('Enter name')

    const updated = {
      ...user,
      name: editName,
      bio: editBio,
      userCountry: editCountry,
      town: editTown,
      phone: editPhone || user?.phone,
      pic: editPic || user?.pic
    }

    safeStorage.write('shopline_user', updated)

    try {
      const profileStore = safeStorage.read('shopline_profiles', {})
      profileStore[updated.email] = updated
      safeStorage.write('shopline_profiles', profileStore)
    } catch {}

    setUser(updated)

    try {
      await supabase.auth.updateUser({
        data: {
          full_name: editName,
          town: editTown,
          userCountry: editCountry,
          phone: editPhone,
          bio: editBio,
          pic: editPic
        }
      })
      await supabase.from('users').upsert([
        {
          email: updated.email,
          name: editName,
          bio: editBio,
          town: editTown,
          userCountry: editCountry,
          phone: editPhone,
          pic: editPic
        }
      ])
    } catch {}

    alert('Profile saved! Will stay after logout.')
    setShowProfile(false)
  }

  const sell = () => {
    if (!t || !p) return alert('Add title & price')

    const np = {
      id: Date.now(),
      title: t,
      desc: d,
      price: p.startsWith('K') ? p : 'K' + p,
      location: loc || editTown || 'Lusaka',
      country: nCountry || editCountry,
      cat: nc,
      image: img,
      owner: user?.email
    }

    setProducts([np, ...products])
    setT('')
    setD('')
    setP('')
    setLoc('')
    setImg('')
    setShowSell(false)
  }

  const filtered = cat === 'All'
    ? products
    : cat === 'Trending'
      ? products.slice(0, 8)
      : products.filter((x) => x.cat === cat)

  const filteredCountry = country !== 'All Countries'
    ? filtered.filter((x) => x.country === country)
    : filtered

  const finalFiltered = search
    ? filteredCountry.filter((x) => x.title.toLowerCase().includes(search.toLowerCase()))
    : filteredCountry

  const myAds = products.filter((pr) => pr.owner === user?.email)
  const initial = getI()
  const picToShow = editPic || user?.pic || ''
  const userEmail = user ? ((user.email || '').replace('@phone.shopline', '') || user.phone) : ''

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Arial' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', alignItems: 'center' }}>
          <div style={{ color: '#16a34a', fontWeight: 900, lineHeight: '14px', fontSize: '15px' }}>SHOPLINE</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {user ? (
              <>
                <button onClick={() => setShowSell(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '10px', fontWeight: 'bold' }}>+ Sell</button>
                <div onClick={() => setShowProfile(true)} style={{ width: '42px', height: '42px', borderRadius: '50%', background: picToShow ? '#fff' : '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', border: '2px solid #16a34a', overflow: 'hidden' }}>
                  {picToShow ? <img src={picToShow} style={{ width: '42px', height: '42px', objectFit: 'cover' }} /> : initial}
                </div>
              </>
            ) : (
              <button onClick={() => setShowLogin(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold' }}>Log In</button>
            )}
          </div>
        </div>
      </header>

      <div style={{ background: 'linear-gradient(135deg,#14532d,#16a34a,#4ade80)', color: '#fff', padding: '18px 14px', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ fontSize: '20px', fontWeight: 900 }}>{user ? `Welcome back, ${user.name}!` : 'Shopline'}</div>
        <div style={{ fontSize: '13px', marginTop: '6px', opacity: 0.95 }}>Buy and Sell in {editCountry || 'Zambia'} - Verified - SEO Ready</div>
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search products...' style={{ width: '100%', padding: '12px 14px 12px 36px', borderRadius: '12px', border: 'none', boxSizing: 'border-box' }} />
            <span style={{ position: 'absolute', left: '12px', top: '11px' }}>🔍</span>
          </div>
          <select value={country} onChange={(e) => setCountry(e.target.value)} style={{ padding: '12px 8px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '12px' }}>
            {allCountriesFilter.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px 14px', maxWidth: '700px', margin: '0 auto' }}>
        {cats.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} style={{ background: cat === c.id ? '#111' : '#f3f4f6', color: cat === c.id ? '#fff' : '#111', border: 'none', padding: '7px 12px', borderRadius: '18px', fontWeight: 'bold', fontSize: '12px' }}>
            {c.i} {c.l}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', maxWidth: '700px', margin: '0 auto', padding: '10px 14px 40px' }}>
        {finalFiltered.map((pr) => (
          <div key={pr.id} style={{ background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '110px', background: '#f1f5f9', borderRadius: '8px' }}>
              {pr.image ? <img src={pr.image} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : <span style={{ fontSize: '28px' }}>{cats.find((x) => x.id === pr.cat)?.i || '🛍️'}</span>}
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '8px' }}>{pr.title}</div>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{pr.desc || ''}</div>
            <div style={{ color: '#16a34a', fontWeight: 'bold', marginTop: '8px' }}>{pr.price}</div>
            <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{pr.location} - {pr.country}</div>
          </div>
        ))}
      </div>

      {user && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '420px', borderRadius: '22px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>My Profile</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '26px', fontWeight: 'bold', overflow: 'hidden' }}>
                {picToShow ? <img src={picToShow} style={{ width: '90px', height: '90px', objectFit: 'cover' }} /> : initial}
              </div>
            </div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Profile Pic</label>
            <input type='file' accept='image/*' onChange={handleProfilePic} style={{ fontSize: '12px' }} />
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Display Name</label>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder='e.g. Chifuka Mwanza' style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Bio</label>
            <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} placeholder='Tell buyers about yourself...' rows={3} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Country</label>
                <select value={editCountry} onChange={(e) => setEditCountry(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }}>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Town</label>
                <input value={editTown} onChange={(e) => setEditTown(e.target.value)} placeholder='Lusaka' style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
              </div>
            </div>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Phone</label>
            <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder='0970...' style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Email</label>
            <input value={userEmail} disabled style={{ padding: '12px', borderRadius: '10px', border: '1px solid #eee', background: '#f3f4f6' }} />
            <button onClick={updateProfile} disabled={loading} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold' }}>{loading ? 'Saving...' : 'Save Profile'}</button>
            <button onClick={() => { safeStorage.remove('shopline_user'); setUser(null); setShowProfile(false); supabase.auth.signOut().catch(() => {}); }} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold' }}>Logout</button>
            <button onClick={() => setShowProfile(false)} style={{ background: '#111', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold' }}>Close</button>
          </div>
        </div>
      )}

      {showLogin && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '360px', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ margin: 0 }}>Shopline Market</h2>
            <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder='Email or phone' style={{ padding: '14px', borderRadius: '12px', border: '1px solid #ccc' }} />
            <div style={{ position: 'relative' }}>
              <input value={pass} onChange={(e) => setPass(e.target.value)} type={showPass ? 'text' : 'password'} placeholder='Password' style={{ width: '100%', padding: '14px 42px 14px 14px', borderRadius: '12px', border: '1px solid #ccc' }} />
              <span onClick={() => setShowPass((s) => !s)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>{showPass ? '🙈' : '👁️'}</span>
            </div>
            <button onClick={login} disabled={loading} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>
              {loading ? 'Waiting...' : 'Log In / Sign Up'}
            </button>
            <button onClick={() => setShowLogin(false)} style={{ background: '#111', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>Cancel</button>
          </div>
        </div>
      )}

      {showVerify && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '360px', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '42px', textAlign: 'center' }}>🔐</div>
            <h2 style={{ margin: 0, textAlign: 'center' }}>Verify Account</h2>
            <p style={{ textAlign: 'center', fontSize: '13px', margin: 0 }}>Code sent to <b>{pendingUser?.email || pendingUser?.phone || contact}</b></p>
            <div style={{ background: '#dcfce7', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' }}>CODE: {generatedCode}</div>
            <input value={verifyInput} onChange={(e) => setVerifyInput(e.target.value)} placeholder='Enter 6-digit code' maxLength={6} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #ccc', textAlign: 'center', fontSize: '22px', letterSpacing: '6px' }} />
            <button onClick={confirmVerify} disabled={loading} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>{loading ? 'Verifying...' : 'Verify & Create'}</button>
            <button onClick={() => { setShowVerify(false); setShowLogin(true) }} style={{ background: '#111', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>Back</button>
          </div>
        </div>
      )}

      {showSell && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 35 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '420px', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h3 style={{ margin: 0 }}>Sell Item</h3>
            <input type='file' accept='image/*' onChange={handleImg} />
            {img && <img src={img} style={{ height: '90px', width: '100%', objectFit: 'cover', borderRadius: '12px' }} />}
            <input value={t} onChange={(e) => setT(e.target.value)} placeholder='Title' style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
            <textarea value={d} onChange={(e) => setD(e.target.value)} placeholder='Description' rows={3} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
            <select value={nc} onChange={(e) => setNc(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }}>
              {cats.filter((c) => c.id !== 'All' && c.id !== 'Trending').map((c) => <option key={c.id} value={c.id}>{c.l}</option>)}
            </select>
            <input value={p} onChange={(e) => setP(e.target.value)} placeholder='Price' style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder='Town' style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
              <select value={nCountry} onChange={(e) => setNCountry(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }}>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={sell} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold' }}>Post Free</button>
            <button onClick={() => setShowSell(false)} style={{ background: '#111', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

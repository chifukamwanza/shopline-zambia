import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import safeStorage from './safeStorage'

import Header from './components/Header'
import AuthModal from './components/AuthModal'
import VerifyModal from './components/VerifyModal'
import ProfileModal from './components/ProfileModal'
import SellModal from './components/SellModal'
import ProductCard from './components/ProductCard'

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

export default function App(){
  const [user,setUser]=useState(()=>safeStorage.read('shopline_user'))
  const [showLogin,setShowLogin]=useState(false)
  const [showVerify,setShowVerify]=useState(false)
  const [showProfile,setShowProfile]=useState(false)
  const [showSell,setShowSell]=useState(false)
  const [contact,setContact]=useState('')
  const [pass,setPass]=useState('')
  const [showPass,setShowPass]=useState(false)
  const [verifyInput,setVerifyInput]=useState('')
  const [generatedCode,setGeneratedCode]=useState('')
  const [pendingUser,setPendingUser]=useState(null)
  const [loading,setLoading]=useState(false)
  const [editName,setEditName]=useState(user?.name||'')
  const [editBio,setEditBio]=useState(user?.bio||'')
  const [editCountry,setEditCountry]=useState(user?.userCountry||'Zambia')
  const [editTown,setEditTown]=useState(user?.town||'')
  const [editPhone,setEditPhone]=useState(user?.phone||'')
  const [editPic,setEditPic]=useState(user?.pic||'')
  const [search,setSearch]=useState('')
  const [cat,setCat]=useState('All')
  const [country,setCountry]=useState('All Countries')
  const [t,setT]=useState('')
  const [d,setD]=useState('')
  const [p,setP]=useState('')
  const [loc,setLoc]=useState('')
  const [nc,setNc]=useState('Phones')
  const [nCountry,setNCountry]=useState('Zambia')
  const [img,setImg]=useState('')
  const [products,setProducts]=useState([{id:1,title:'iPhone 13 Pro',desc:'Very clean 256GB',price:'K8500',location:'Lusaka',country:'Zambia',cat:'Phones',owner:'test@test.com'},{id:2,title:'Toyota Hilux 2020',desc:'Diesel low mileage',price:'K185000',location:'Ndola',country:'Zambia',cat:'Vehicles',owner:'test@test.com'}])

  useEffect(()=>{
    const pageTitle = cat==='All' ? `Shopline - Buy & Sell Phones, Cars, Property | ${country}` : `${cat} for Sale in ${country} - ${search||'Best Price'} | Shopline`
    document.title = pageTitle
    let metaDesc = document.querySelector('meta[name="description"]')
    if(!metaDesc){ metaDesc=document.createElement('meta'); metaDesc.name='description'; document.head.appendChild(metaDesc) }
    metaDesc.content = `Find ${cat} for sale in ${country}. ${products.length}+ verified ads. Buy ${cat} in ${country} - best prices on Shopline.`
    const schema = { "@context":"https://schema.org", "@type":"WebSite", "name":"Shopline", "url": window.location.href, "potentialAction": { "@type":"SearchAction", "target": window.location.origin + "/?search={search_term}", "query-input":"required name=search_term" } }
    let sc = document.getElementById('seo-schema')
    if(!sc){ sc=document.createElement('script'); sc.id='seo-schema'; sc.type='application/ld+json'; document.head.appendChild(sc) }
    sc.textContent = JSON.stringify(schema)
  },[cat,country,search,products.length])

  useEffect(()=>{
    if(user){ safeStorage.write('shopline_user', user) } else { safeStorage.remove('shopline_user') }
  },[user])

  useEffect(()=>{
    setEditName(user?.name||'')
    setEditBio(user?.bio||'')
    setEditCountry(user?.userCountry||'Zambia')
    setEditTown(user?.town||'')
    setEditPhone(user?.phone||'')
    setEditPic(user?.pic||'')
  },[user])

  const getI=()=>{const pic=editPic||user?.pic;if(pic)return '';return (editName||user?.name||'C').charAt(0).toUpperCase()}
  const handleProfilePic=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setEditPic(ev.target.result);r.readAsDataURL(f)}
  const handleImg=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setImg(ev.target.result);r.readAsDataURL(f)}

  const login = async ()=>{
    if(!contact||!pass) return alert('Enter email/phone and password')
    setLoading(true)
    try{
      const normalized = contact.trim()
      const isPhone = !normalized.includes('@')
      const authEmail = buildAuthEmail(normalized)
      const localProfile = safeStorage.read('shopline_profiles', {})

      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({ email: authEmail, password: pass })

      if(signInError){
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email: authEmail, password: pass, options:{ data:{ full_name: isPhone?normalized:normalized.split('@')[0] } } })
        if(signUpError) throw signUpError
        const createdProfile = { email: authEmail, name: isPhone?normalized:normalized.split('@')[0], phone: isPhone?normalized:'', userCountry: 'Zambia' }
        localProfile[authEmail] = createdProfile
        safeStorage.write('shopline_profiles', localProfile)
        const code = Math.floor(100000+Math.random()*900000).toString()
        setGeneratedCode(code)
        setPendingUser(createdProfile)
        setShowLogin(false)
        setShowVerify(true)
        setLoading(false)
        return
      }

      const profile = { email: authData.user.email, name: authData.user.user_metadata?.full_name || (isPhone?normalized:normalized.split('@')[0]), phone: isPhone?normalized:'', userCountry: 'Zambia' }
      localProfile[authEmail] = profile
      safeStorage.write('shopline_profiles', localProfile)
      safeStorage.write('shopline_user', profile)
      setUser(profile)
      setEditName(profile.name||'')
      setEditBio(profile.bio||'')
      setEditCountry(profile.userCountry||'Zambia')
      setEditTown(profile.town||'')
      setEditPhone(profile.phone||'')
      setEditPic(profile.pic||'')
      setShowLogin(false)
      setContact('')
      setPass('')

    }catch(e){alert(e.message||'Unable to login')}finally{setLoading(false)}
  }

  const confirmVerify = async ()=>{
    if(verifyInput!==generatedCode) return alert('Wrong code. Your code: '+generatedCode)
    setLoading(true)
    try{
      const userProfile = pendingUser || user
      const merged = { ...userProfile, name: userProfile?.name || editName || 'Shopline User', bio: userProfile?.bio || editBio || '', userCountry: userProfile?.userCountry || editCountry || 'Zambia', town: userProfile?.town || editTown || '', phone: userProfile?.phone || editPhone || '', pic: userProfile?.pic || editPic || '' }
      const store = safeStorage.read('shopline_profiles', {})
      store[merged.email] = merged
      safeStorage.write('shopline_profiles', store)
      safeStorage.write('shopline_user', merged)
      setUser(merged)

      await supabase.from('users').upsert([{ email: merged.email, name: merged.name, bio: merged.bio, phone: merged.phone, userCountry: merged.userCountry, town: merged.town, pic: merged.pic, verified:true }])

      setShowVerify(false)
      setVerifyInput('')
      setPendingUser(null)
      setContact('')
      setPass('')
    }catch(e){alert(e.message||'Verification failed')}finally{setLoading(false)}
  }

  const updateProfile = async ()=>{
    if(!editName) return alert('Enter name')
    const updated = { ...user, name: editName, bio: editBio, userCountry: editCountry, town: editTown, phone: editPhone||user?.phone, pic: editPic||user?.pic }
    safeStorage.write('shopline_user', updated)
    try{ const profileStore = safeStorage.read('shopline_profiles',{}); profileStore[updated.email]=updated; safeStorage.write('shopline_profiles', profileStore)}catch{}
    setUser(updated)
    try{ await supabase.auth.updateUser({ data: { full_name: editName, town: editTown, userCountry: editCountry, phone: editPhone, bio: editBio, pic: editPic } }); await supabase.from('users').upsert([{ email: updated.email, name: editName, bio: editBio, town: editTown, userCountry: editCountry, phone: editPhone, pic: editPic }]) }catch{}
    alert('Profile saved! Will stay after logout.')
    setShowProfile(false)
  }

  const sell = ()=>{ if(!t||!p) return alert('Add title & price'); const np={ id:Date.now(), title:t, desc:d, price:p.startsWith('K')?p:'K'+p, location: loc||editTown||'Lusaka', country: nCountry||editCountry, cat: nc, image: img, owner: user?.email }; setProducts([np,...products]); setT(''); setD(''); setP(''); setLoc(''); setImg(''); setShowSell(false) }

  let filtered = cat==='All'?products:cat==='Trending'?products.slice(0,8):products.filter(x=>x.cat===cat)
  if(country!=='All Countries') filtered = filtered.filter(x=>x.country===country)
  if(search) filtered = filtered.filter(x=>x.title.toLowerCase().includes(search.toLowerCase()))
  const myAds = products.filter(pr=>pr.owner===user?.email)
  const initial = getI()
  const picToShow = editPic||user?.pic||''
  const userEmail = user?((user.email||'').replace('@phone.shopline','')||user.phone):''

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'Arial'}}>
      <Header user={user} onSellClick={()=>setShowSell(true)} onProfileClick={()=>setShowProfile(true)} onLoginClick={()=>setShowLogin(true)} picToShow={picToShow} initial={initial} />

      <div style={{background:'linear-gradient(135deg,#14532d,#16a34a,#4ade80)',color:'#fff',padding:'18px 14px',maxWidth:'700px',margin:'0 auto'}}>
        <div style={{fontSize:'20px',fontWeight:900}}>{user?`Welcome back, ${user.name}!`:'Shopline'}</div>
        <div style={{fontSize:'13px',marginTop:'6px',opacity:0.95}}>Buy and Sell globally - Verified - SEO Ready</div>
        <div style={{marginTop:'12px',display:'flex',gap:'8px'}}>
          <div style={{flex:1,position:'relative'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Search products...' style={{width:'100%',padding:'12px 14px 12px 36px',borderRadius:'12px',border:'none',boxSizing:'border-box'}}/>
            <span style={{position:'absolute',left:'12px',top:'11px'}}>🔍</span>
          </div>
          <select value={country} onChange={e=>setCountry(e.target.value)} style={{padding:'12px 8px',borderRadius:'12px',border:'none',fontWeight:'bold',fontSize:'12px'}}>
            {allCountriesFilter.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{display:'flex',flexWrap:'wrap',gap:'8px',padding:'12px 14px',maxWidth:'700px',margin:'0 auto'}}>
        {cats.map(c=> <button key={c.id} onClick={()=>setCat(c.id)} style={{background:cat===c.id?'#111':'#f3f4f6',color:cat===c.id?'#fff':'#111',border:'none',padding:'7px 12px',borderRadius:'18px',fontWeight:'bold',fontSize:'12px'}}>{c.i} {c.l}</button>)}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',gap:'12px',maxWidth:'700px',margin:'0 auto',padding:'10px 14px 40px'}}>
        {filtered.map(pr=> <ProductCard key={pr.id} pr={pr} cats={cats} />)}
      </div>

      <ProfileModal show={showProfile} userEmail={userEmail} picToShow={picToShow} initial={initial} editName={editName} setEditName={setEditName} editBio={editBio} setEditBio={setEditBio} editCountry={editCountry} setEditCountry={setEditCountry} editTown={editTown} setEditTown={setEditTown} editPhone={editPhone} setEditPhone={setEditPhone} handleProfilePic={handleProfilePic} onSave={updateProfile} onLogout={()=>{ safeStorage.remove('shopline_user'); setUser(null); setShowProfile(false); supabase.auth.signOut().catch(()=>{}) }} onClose={()=>setShowProfile(false)} loading={loading} countries={countries} />

      <AuthModal show={showLogin} contact={contact} setContact={setContact} pass={pass} setPass={setPass} showPass={showPass} setShowPass={setShowPass} onLogin={login} onClose={()=>setShowLogin(false)} loading={loading} />

      <VerifyModal show={showVerify} pendingUser={pendingUser} generatedCode={generatedCode} verifyInput={verifyInput} setVerifyInput={setVerifyInput} onConfirm={confirmVerify} onBack={()=>{ setShowVerify(false); setShowLogin(true) }} loading={loading} />

      <SellModal show={showSell} img={img} handleImg={handleImg} t={t} setT={setT} d={d} setD={setD} nc={nc} setNc={setNc} p={p} setP={setP} loc={loc} setLoc={setLoc} nCountry={nCountry} setNCountry={setNCountry} countries={countries} cats={cats} onSell={sell} onClose={()=>setShowSell(false)} />

    </div>
  )
}

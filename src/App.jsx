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

const countries = ['Zambia','Tanzania','Kenya','Uganda','Rwanda','Burundi','DRC','Malawi','Mozambique','Zimbabwe','South Africa','Botswana','Namibia','Angola','Nigeria','Ghana','Ethiopia','USA','UK','UAE','China','India']
const allCountriesFilter = ['All Countries', ...countries]

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

  // FIX: Sync profile fields when user or modal opens
  useEffect(()=>{
    if(user){
      setEditName(user.name||'')
      setEditBio(user.bio||'')
      setEditCountry(user.userCountry||'Zambia')
      setEditTown(user.town||'')
      setEditPhone(user.phone||'')
      setEditPic(user.pic||'')
    }
  },[user, showProfile])

  // SEO FOR MONEY
  useEffect(()=>{
    const pageTitle = cat==='All' ? `Shopline - Buy & Sell Phones, Cars, Property | ${country}` : `${cat} for Sale in ${country} - ${search||'Best Price'} | Shopline`
    document.title = pageTitle
    let metaDesc = document.querySelector('meta[name="description"]')
    if(!metaDesc){ metaDesc=document.createElement('meta'); metaDesc.name='description'; document.head.appendChild(metaDesc) }
    metaDesc.content = `Find ${cat} for sale in ${country}. ${products.length}+ verified ads. Buy ${cat} in ${country} - best prices on Shopline.`
    const schema = { "@context":"https://schema.org", "@type":"WebSite", "name":"Shopline", "url": window.location.href }
    let sc = document.getElementById('seo-schema')
    if(!sc){ sc=document.createElement('script'); sc.id='seo-schema'; sc.type='application/ld+json'; document.head.appendChild(sc) }
    sc.textContent = JSON.stringify(schema)
  },[cat,country,search,products.length])

  const buildEmail = (c)=> c.includes('@')?c:`${c}@phone.shopline`

  const login=async()=>{
    if(!contact||!pass) return alert('Enter email/phone and password')
    setLoading(true)
    try{
      const v=contact.trim()
      let found=null
      const isPhone=!v.includes('@')
      if(isPhone){
        const {data:d1}=await supabase.from('users').select('*').eq('phone',v).maybeSingle()
        if(d1) found=d1
        if(!found){ const {data:d2}=await supabase.from('users').select('*').eq('email',buildEmail(v)).maybeSingle(); if(d2) found=d2 }
      }else{
        const {data:d3}=await supabase.from('users').select('*').eq('email',v).maybeSingle()
        if(d3) found=d3
      }
      if(found){
        if(found.password===pass){
          try{ const m=safeStorage.read('shopline_profiles')||{}; if(m[found.email]) found={...found,...m[found.email]} }catch{}
          safeStorage.write('shopline_user', found)
          setUser(found)
          setShowLogin(false); setContact(''); setPass('')
        }else alert('Wrong password')
      }else{
        const code=Math.floor(100000+Math.random()*900000).toString()
        setGeneratedCode(code)
        const nd=isPhone?{phone:v,email:buildEmail(v),password:pass,name:v}:{email:v,phone:v,password:pass,name:v.split('@')[0]}
        setPendingUser(nd)
        setShowLogin(false); setShowVerify(true)
        setLoading(false); return
      }
    }catch(e){ alert(e.message) }
    setLoading(false)
  }

  const confirmVerify=async()=>{
    if(verifyInput!==generatedCode) return alert('Wrong code. Your code: '+generatedCode)
    setLoading(true)
    try{
      const {data:nu}=await supabase.from('users').insert([{...pendingUser,verified:true}]).select().single()
      if(nu){
        safeStorage.write('shopline_user', nu)
        setUser(nu)
      }
      setShowVerify(false); setVerifyInput(''); setPendingUser(null); setContact(''); setPass('')
    }catch(e){ alert(e.message) }
    setLoading(false)
  }

  const updateProfile=async()=>{
    if(!editName) return alert('Enter name')
    const updated={...user,name:editName,bio:editBio,userCountry:editCountry,town:editTown,phone:editPhone||user.phone,pic:editPic||user?.pic}
    safeStorage.write('shopline_user', updated)
    try{
      const m=safeStorage.read('shopline_profiles')||{}
      m[updated.email]=updated
      safeStorage.write('shopline_profiles', m)
    }catch{}
    setUser(updated)
    setLoading(true)
    try{
      await supabase.from('users').update({name:editName,phone:editPhone}).eq('email', user.email)
    }catch{}
    setLoading(false)
    alert('Profile saved! Will stay after logout.')
    setShowProfile(false)
  }

  const sell=()=>{
    if(!t||!p) return alert('Add title & price')
    const np={id:Date.now(),title:t,desc:d,price:p.startsWith('K')?p:'K'+p,location:loc||editTown||'Lusaka',country:nCountry||editCountry,cat:nc,image:img,owner:user?.email}
    setProducts([np,...products])
    setT(''); setD(''); setP(''); setLoc(''); setImg(''); setShowSell(false)
  }

  let filtered=cat==='All'?products:cat==='Trending'?products.slice(0,8):products.filter(x=>x.cat===cat)
  if(country!=='All Countries') filtered=filtered.filter(x=>x.country===country)
  if(search) filtered=filtered.filter(x=>x.title.toLowerCase().includes(search.toLowerCase()))
  const myAds=products.filter(pr=>pr.owner===user?.email)

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'Arial'}}>
      <Header user={user} search={search} setSearch={setSearch} country={country} setCountry={setCountry} allCountriesFilter={allCountriesFilter} cat={cat} setCat={setCat} cats={cats} setShowSell={setShowSell} setShowProfile={setShowProfile} setShowLogin={setShowLogin} editCountry={editCountry} />

      <div style={{padding:'10px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',maxWidth:'700px',margin:'0 auto'}}>
        {filtered.map(pr=> <ProductCard key={pr.id} pr={pr} cats={cats} />)}
      </div>

      {showProfile && <ProfileModal user={user} editName={editName} setEditName={setEditName} editBio={editBio} setEditBio={setEditBio} editCountry={editCountry} setEditCountry={setEditCountry} editTown={editTown} setEditTown={setEditTown} editPhone={editPhone} setEditPhone={setEditPhone} editPic={editPic} setEditPic={setEditPic} onSave={updateProfile} onClose={()=>setShowProfile(false)} myAds={myAds} loading={loading} />}

      {showLogin && <AuthModal contact={contact} setContact={setContact} pass={pass} setPass={setPass} showPass={showPass} setShowPass={setShowPass} onLogin={login} onClose={()=>setShowLogin(false)} loading={loading} />}

      {showVerify && <VerifyModal pendingUser={pendingUser} generatedCode={generatedCode} verifyInput={verifyInput} setVerifyInput={setVerifyInput} onConfirm={confirmVerify} onBack={()=>{setShowVerify(false);setShowLogin(true)}} loading={loading} />}

      {showSell && <SellModal t={t} setT={setT} d={d} setD={setD} p={p} setP={setP} loc={loc} setLoc={setLoc} nc={nc} setNc={setNc} nCountry={nCountry} setNCountry={setNCountry} img={img} setImg={setImg} cats={cats} countries={countries} onSell={sell} onClose={()=>setShowSell(false)} />}
    </div>
  )
  }

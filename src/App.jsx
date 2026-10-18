import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import safeStorage from './safeStorage'
export default function App(){
const cats=[{id:'All',l:'All',i:'★'},{id:'Trending',l:'Trending',i:'🔥'},{id:'Phones',l:'Phones',i:'📱'},{id:'Laptops',l:'Laptops',i:'💻'},{id:'Electronics',l:'Electronics',i:'🔌'},{id:'Fashion Men',l:'Men',i:'👕'},{id:'Fashion Women',l:'Women',i:'👗'},{id:'Shoes',l:'Shoes',i:'👟'},{id:'Beauty',l:'Beauty',i:'💄'},{id:'Home',l:'Home',i:'🏠'},{id:'Vehicles',l:'Vehicles',i:'🚗'},{id:'Property',l:'Property',i:'🏢'},{id:'Food',l:'Food',i:'🍎'},{id:'Livestock',l:'Livestock',i:'🐄'},{id:'Farming',l:'Farming',i:'🌾'},{id:'Services',l:'Services',i:'🔧'},{id:'Jobs',l:'Jobs',i:'💼'},{id:'Kids',l:'Kids',i:'👶'},{id:'Sports',l:'Sports',i:'⚽'},{id:'Books',l:'Books',i:'📚'},{id:'Pets',l:'Pets',i:'🐶'},]
const countries=['Zambia','Tanzania','Kenya','Uganda','Rwanda','Burundi','DRC','Malawi','Mozambique','Zimbabwe','South Africa','Botswana','Namibia','Angola','Nigeria','Ghana','Ethiopia','USA','UK','UAE','China','India']
const allCountriesFilter=['All Countries',...countries]
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

useEffect(() => {
  if (user) {
    safeStorage.write('shopline_user', user)
  } else {
    safeStorage.remove('shopline_user')
  }
}, [user])

useEffect(() => {
  setEditName(user?.name||'')
  setEditBio(user?.bio||'')
  setEditCountry(user?.userCountry||'Zambia')
  setEditTown(user?.town||'')
  setEditPhone(user?.phone||'')
  setEditPic(user?.pic||'')
}, [user])

const getI=()=>{const pic=editPic||user?.pic;if(pic)return '';return (editName||user?.name||'C').charAt(0).toUpperCase()}
const handleProfilePic=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setEditPic(ev.target.result);r.readAsDataURL(f)}
const handleImg=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setImg(ev.target.result);r.readAsDataURL(f)}
// === SEO FOR MONEY ===
useEffect(()=>{
  const pageTitle = cat==='All' ? `Shopline Zambia - Buy & Sell Phones, Cars, Property | ${country}` : `${cat} for Sale in ${country} - ${search||'Best Price'} | Shopline Zambia`
  document.title = pageTitle
  let metaDesc = document.querySelector('meta[name="description"]')
  if(!metaDesc){ metaDesc=document.createElement('meta'); metaDesc.name='description'; document.head.appendChild(metaDesc) }
  metaDesc.content = `Find ${cat} for sale in ${country}. ${products.length}+ verified ads. Buy ${cat} in ${country} - best prices on Shopline Zambia.`
  const schema = { "@context":"https://schema.org", "@type":"WebSite", "name":"Shopline", "url": window.location.href, "potentialAction": { "@type":"SearchAction", "target": window.location.origin + "/?search={search_term}", "query-input":"required name=search_term" } }
  let sc = document.getElementById('seo-schema')
  if(!sc){ sc=document.createElement('script'); sc.id='seo-schema'; sc.type='application/ld+json'; document.head.appendChild(sc) }
  sc.textContent = JSON.stringify(schema)
},[cat,country,search,products.length])
const login=async()=>{if(!contact||!pass)return alert('Enter email/phone and password');setLoading(true);try{const v=contact.trim();let found=null;const isPhone=!v.includes('@');if(isPhone){const {data:d1}=await supabase.from('users').select('*').eq('phone',v).maybeSingle();if(d1)found=d1;if(!found){const {data:d2}=await supabase.from('users').select('*').eq('email',v+'@phone.shopline').maybeSingle();if(d2)found=d2}}else{const {data:d3}=await supabase.from('users').select('*').eq('email',v).maybeSingle();if(d3)found=d3}if(found){if(found.password===pass){try{const m=safeStorage.read('shopline_profiles',{});if(m[found.email])found={...found,...m[found.email]}}catch{}safeStorage.write('shopline_user',found);setUser(found);setEditName(found.name||'');setEditBio(found.bio||'');setEditCountry(found.userCountry||'Zambia');setEditTown(found.town||'');setEditPhone(found.phone||'');setEditPic(found.pic||'');setShowLogin(false);setContact('');setPass('')}else alert('Wrong password')}else{const code=Math.floor(100000+Math.random()*900000).toString();setGeneratedCode(code);const nd=isPhone?{phone:v,email:v+'@phone.shopline',password:pass,name:v}:{email:v,phone:v,password:pass,name:v.split('@')[0]};setPendingUser(nd);setShowLogin(false);setShowVerify(true);setLoading(false);return}}catch(e){alert(e.message)}setLoading(false)}
const confirmVerify=async()=>{if(verifyInput!==generatedCode)return alert('Wrong code. Your code: '+generatedCode);setLoading(true);try{const {data:nu}=await supabase.from('users').insert([{...pendingUser,verified:true,userCountry:'Zambia'}]).select().single();if(nu){safeStorage.write('shopline_user',nu);setUser(nu);setEditName(nu.name||'');setEditPic(nu.pic||'')}setShowVerify(false);setVerifyInput('');setPendingUser(null);setContact('');setPass('')}catch(e){alert(e.message)}setLoading(false)}
const updateProfile=async()=>{if(!editName)return alert('Enter name');const updated={...user,name:editName,bio:editBio,userCountry:editCountry,town:editTown,phone:editPhone||user.phone,pic:editPic||user?.pic};safeStorage.write('shopline_user',updated);try{const m=safeStorage.read('shopline_profiles',{});m[updated.email]=updated;safeStorage.write('shopline_profiles',m)}catch{}setUser(updated);setLoading(true);try{await supabase.from('users').update({name:editName,bio:editBio,town:editTown,userCountry:editCountry,phone:editPhone,pic:editPic}).eq('email',user.email)}catch{}setLoading(false);alert('Profile saved! Will stay after logout.');setShowProfile(false)}
const sell=()=>{if(!t||!p)return alert('Add title & price');const np={id:Date.now(),title:t,desc:d,price:p.startsWith('K')?p:'K'+p,location:loc||editTown||'Lusaka',country:nCountry||editCountry,cat:nc,image:img,owner:user?.email};setProducts([np,...products]);setT('');setD('');setP('');setLoc('');setImg('');setShowSell(false)}
let filtered=cat==='All'?products:cat==='Trending'?products.slice(0,8):products.filter(x=>x.cat===cat)
if(country!=='All Countries')filtered=filtered.filter(x=>x.country===country)
if(search)filtered=filtered.filter(x=>x.title.toLowerCase().includes(search.toLowerCase()))
const myAds=products.filter(pr=>pr.owner===user?.email)
const initial=getI()
const picToShow=editPic||user?.pic||''
const userEmail=user?((user.email||'').replace('@phone.shopline','')||user.phone):''
return(<div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'Arial'}}><header style={{background:'#fff',borderBottom:'1px solid #eee',position:'sticky',top:0,zIndex:10}}><div style={{display:'flex',justifyContent:'space-between',padding:'10px 12px',alignItems:'center'}}><div style={{color:'#16a34a',fontWeight:900,lineHeight:'14px',fontSize:'15px'}}>SHOPLINE</div><div style={{display:'flex',gap:'8px',alignItems:'center'}}>{user?<><button onClick={()=>setShowSell(true)} style={{background:'#16a34a',color:'#fff',border:'none',padding:'10px 14px',borderRadius:'10px',fontWeight:'bold'}}>+ Sell</button><div onClick={()=>setShowProfile(true)} style={{width:'42px',height:'42px',borderRadius:'50%',background:picToShow?'#fff':'#111',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',cursor:'pointer',border:'2px solid #16a34a',overflow:'hidden'}}>{picToShow?<img src={picToShow} style={{width:'42px',height:'42px',objectFit:'cover'}}/>:initial}</div></>:<button onClick={()=>setShowLogin(true)} style={{background:'#16a34a',color:'#fff',border:'none',padding:'10px 18px',borderRadius:'10px',fontWeight:'bold'}}>Log In</button>}</div></div></header><div style={{background:'linear-gradient(135deg,#14532d,#16a34a,#4ade80)',color:'#fff',padding:'18px 14px',maxWidth:'700px',margin:'0 auto'}}><div style={{fontSize:'20px',fontWeight:900}}>{user?`Welcome back, ${user.name}!`:'Shopline'}</div><div style={{fontSize:'13px',marginTop:'6px',opacity:0.95}}>Buy and Sell in {editCountry||'Zambia'} - Verified - SEO Ready</div><div style={{marginTop:'12px',display:'flex',gap:'8px'}}><div style={{flex:1,position:'relative'}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Search products...' style={{width:'100%',padding:'12px 14px 12px 36px',borderRadius:'12px',border:'none',boxSizing:'border-box'}}/><span style={{position:'absolute',left:'12px',top:'11px'}}>🔍</span></div><select value={country} onChange={e=>setCountry(e.target.value)} style={{padding:'12px 8px',borderRadius:'12px',border:'none',fontWeight:'bold',fontSize:'12px'}}/>
</div></div>)
}

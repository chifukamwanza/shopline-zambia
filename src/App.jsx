import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://kfusttbmgbxklwnexdyk.supabase.co','sb_publishable_XGyHpQhM0l2YLZPrQSqSSg_I0axJuXd')

const sendRealCode = async (contact, code) => {
  const isPhone = !contact.includes('@')
  try {
    if (!isPhone) {
      await supabase.auth.signInWithOtp({ email: contact })
      return true
    } else {
      try {
        await fetch('https://textbelt.com/text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: contact, message: `Shopline code: ${code}`, key: 'textbelt' })
        })
      } catch {}
      return true
    }
  } catch { return false }
}

export default function App(){
const cats=[
{id:'All',l:'All',i:'★'},{id:'Trending',l:'Trending',i:'🔥'},{id:'Phones',l:'Phones',i:'📱'},{id:'Laptops',l:'Laptops',i:'💻'},{id:'Electronics',l:'Electronics',i:'🔌'},{id:'Fashion Men',l:'Men',i:'👕'},{id:'Fashion Women',l:'Women',i:'👗'},{id:'Shoes',l:'Shoes',i:'👟'},{id:'Beauty',l:'Beauty',i:'💄'},{id:'Home',l:'Home',i:'🏠'},{id:'Vehicles',l:'Vehicles',i:'🚗'},{id:'Property',l:'Property',i:'🏢'},{id:'Food',l:'Food',i:'🍎'},{id:'Livestock',l:'Livestock',i:'🐄'},{id:'Farming',l:'Farming',i:'🌾'},{id:'Services',l:'Services',i:'🔧'},{id:'Jobs',l:'Jobs',i:'💼'},{id:'Kids',l:'Kids',i:'👶'},{id:'Sports',l:'Sports',i:'⚽'},{id:'Books',l:'Books',i:'📚'},{id:'Pets',l:'Pets',i:'🐶'},
]
const countries=['All Countries','Zambia','Kenya','Nigeria','South Africa','Tanzania','Uganda','Ghana','Rwanda','Botswana','Malawi','Zimbabwe','USA','UK','India','China','UAE','Canada','Australia']
const [user,setUser]=useState(null)
const [contact,setContact]=useState('')
const [pass,setPass]=useState('')
const [showPass,setShowPass]=useState(false)
const [showLogin,setShowLogin]=useState(false)
const [showSell,setShowSell]=useState(false)
const [showProfile,setShowProfile]=useState(false)
const [loading,setLoading]=useState(false)
const [cat,setCat]=useState('All')
const [country,setCountry]=useState('All Countries')
const [search,setSearch]=useState('')
const [showVerify,setShowVerify]=useState(false)
const [verifyInput,setVerifyInput]=useState('')
const [generatedCode,setGeneratedCode]=useState('')
const [pendingUser,setPendingUser]=useState(null)
const [products,setProducts]=useState([
{id:1,title:'iPhone 14 Pro',price:'K12,500',location:'Lusaka',country:'Zambia',cat:'Phones',image:''},
{id:2,title:'Nike Shoes',price:'K850',location:'Ndola',country:'Zambia',cat:'Shoes',image:''},
{id:3,title:'Tomatoes 10kg',price:'K200',location:'Chipata',country:'Zambia',cat:'Food',image:''},
{id:4,title:'Toyota Corolla',price:'K85,000',location:'Lusaka',country:'Zambia',cat:'Vehicles',image:''},
{id:5,title:'Samsung TV 55 inch',price:'K6,500',location:'Nairobi',country:'Kenya',cat:'Electronics',image:''},
{id:6,title:'Ladies Dress',price:'K450',location:'Lagos',country:'Nigeria',cat:'Fashion Women',image:''},
])
const [t,setT]=useState('');const [p,setP]=useState('');const [loc,setLoc]=useState('');const [img,setImg]=useState('');const [nc,setNc]=useState('Phones');const [nCountry,setNCountry]=useState('Zambia')
useEffect(()=>{const s=localStorage.getItem('shopline_user');if(s)setUser(JSON.parse(s))},[])
const getI=()=>{if(!user)return 'C';let n=user.name||'C';return n[0].toUpperCase()}
const handleImg=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>setImg(r.result);r.readAsDataURL(f)}
const login=async()=>{
if(!contact||!pass)return alert('Enter email/phone and password');
setLoading(true);
try{
const v=contact.trim();
let found=null;
const isPhone=!v.includes('@');
if(isPhone){
  const {data:d1}=await supabase.from('users').select('*').eq('phone',v).maybeSingle();
  if(d1) found=d1;
  if(!found){
    const {data:d2}=await supabase.from('users').select('*').eq('email',v+'@phone.shopline').maybeSingle();
    if(d2) found=d2;
  }
}else{
  const {data:d3}=await supabase.from('users').select('*').eq('email',v).maybeSingle();
  if(d3) found=d3;
}
if(found){
  if(found.password===pass){
    localStorage.setItem('shopline_user',JSON.stringify(found));
    setUser(found);setShowLogin(false);setContact('');setPass('');
  }else alert('Wrong password');
}else{
  const code=Math.floor(100000+Math.random()*900000).toString();
  setGeneratedCode(code);
  const nd=isPhone?{phone:v,email:v+'@phone.shopline',password:pass,name:v}:{email:v,phone:v,password:pass,name:v.split('@')[0]};
  setPendingUser(nd);
  await sendRealCode(v, code);
  setShowLogin(false);
  setShowVerify(true);
  setLoading(false);
  return;
}
}catch(e){alert(e.message)}
setLoading(false)
}
const confirmVerify=async()=>{
if(verifyInput!==generatedCode) return alert('Invalid code. Your code: '+generatedCode);
setLoading(true);
try{
  const resp = await supabase.from('users').insert([{...pendingUser,verified:true}]).select().single();
  const nu = resp.data;
  const fail = resp.error;
  if(fail){
    if(fail.message.includes('duplicate')||fail.message.includes('unique')){
      const {data:retry}=await supabase.from('users').select('*').eq('email',pendingUser.email).maybeSingle();
      if(retry){localStorage.setItem('shopline_user',JSON.stringify(retry));setUser(retry);}
    }else alert(fail.message)
  }else{
    localStorage.setItem('shopline_user',JSON.stringify(nu));
    setUser(nu);
  }
  setShowVerify(false);setVerifyInput('');setPendingUser(null);setContact('');setPass('');
}catch(e){alert(e.message)}
setLoading(false)
}
const sell=()=>{if(!t||!p)return alert('Add title price');const np={id:Date.now(),title:t,price:p.startsWith('K')?p:'K'+p,location:loc||'Lusaka',country:nCountry,cat:nc,image:img};setProducts([np,...products]);setT('');setP('');setLoc('');setImg('');setShowSell(false)}
let filtered=cat==='All'?products:cat==='Trending'?products.slice(0,8):products.filter(x=>x.cat===cat)
if(country!=='All Countries') filtered=filtered.filter(x=>x.country===country)
if(search) filtered=filtered.filter(x=>x.title.toLowerCase().includes(search.toLowerCase()))
const initial=getI()
const userEmail=user?((user.email||'').replace('@phone.shopline','')||user.phone):''
return(
<div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'Arial'}}>
<header style={{background:'#fff',borderBottom:'1px solid #eee',position:'sticky',top:0,zIndex:10}}><div style={{display:'flex',justifyContent:'space-between',padding:'10px 12px',alignItems:'center'}}><div style={{color:'#16a34a',fontWeight:900,lineHeight:'14px',fontSize:'15px'}}>SHOPLINE<br/>MARKET</div><div style={{display:'flex',gap:'8px',alignItems:'center'}}>{user?<><button onClick={()=>setShowSell(true)} style={{background:'#16a34a',color:'#fff',border:'none',padding:'10px 14px',borderRadius:'10px',fontWeight:'bold'}}>+ Sell</button><div onClick={()=>setShowProfile(true)} style={{width:'40px',height:'40px',borderRadius:'50%',background:'#111',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',cursor:'pointer'}}>{initial}</div><button onClick={()=>{localStorage.removeItem('shopline_user');setUser(null);setShowProfile(false)}} style={{background:'#dc2626',color:'#fff',border:'none',padding:'10px 14px',borderRadius:'10px',fontWeight:'bold'}}>Logout</button></>:<button onClick={()=>setShowLogin(true)} style={{background:'#16a34a',color:'#fff',border:'none',padding:'10px 18px',borderRadius:'10px',fontWeight:'bold'}}>Log In</button>}</div></div></header>
<div style={{background:'linear-gradient(135deg,#14532d,#16a34a,#4ade80)',color:'#fff',padding:'18px 14px',maxWidth:'700px',margin:'0 auto'}}>
<div style={{fontSize:'20px',fontWeight:'900'}}>{user?`Welcome back, ${user.name||'Chifuka'}!`:'Welcome to Shopline Market!'}</div>
<div style={{fontSize:'13px',marginTop:'6px',opacity:0.95}}>{user?`${filtered.length} items in ${country}. Verified & Trusted.`:'Buy and Sell Anything, Anywhere - Free, Fast & Trusted.'}</div>
<div style={{marginTop:'12px',display:'flex',gap:'8px'}}><div style={{flex:1,position:'relative'}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Search...' style={{width:'100%',padding:'12px 14px 12px 36px',borderRadius:'12px',border:'none',boxSizing:'border-box'}}/><span style={{position:'absolute',left:'12px',top:'11px'}}>🔍</span></div><select value={country} onChange={e=>setCountry(e.target.value)} style={{padding:'12px 8px',borderRadius:'12px',border:'none',fontWeight:'bold',fontSize:'12px'}}>{countries.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
</div>
<div style={{background:'#fff',padding:'10px',display:'flex',gap:'8px',overflowX:'auto',maxWidth:'700px',margin:'0 auto',borderBottom:'1px solid #eee'}}>{cats.map(c=><button key={c.id} onClick={()=>setCat(c.id)} style={{background:cat===c.id?'#111':'#f3f4f6',color:cat===c.id?'#fff':'#111',border:'none',padding:'7px 12px',borderRadius:'18px',fontSize:'12px',fontWeight:'bold',flexShrink:0}}>{c.i} {c.l}</button>)}</div>
<div style={{padding:'10px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',maxWidth:'700px',margin:'0 auto'}}>{filtered.map(pr=><div key={pr.id} style={{background:'#fff',padding:'8px',borderRadius:'12px',border:'1px solid #eee'}}><div style={{background:'#f1f5f9',height:'110px',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px'}}>{pr.image?<img src={pr.image} style={{width:'100%',height:'110px',objectFit:'cover',borderRadius:'8px'}}/>:cats.find(x=>x.id===pr.cat)?.i||'📦'}</div><div style={{display:'flex',gap:'4px',marginTop:'6px'}}><span style={{fontSize:'9px',background:'#dcfce7',padding:'2px 6px',borderRadius:'8px',fontWeight:'bold'}}>{pr.cat}</span><span style={{fontSize:'9px',background:'#f3f4f6',padding:'2px 6px',borderRadius:'8px'}}>{pr.country}</span></div><div style={{fontWeight:'bold',fontSize:'13px',marginTop:'4px',height:'32px',overflow:'hidden'}}>{pr.title}</div><div style={{color:'#16a34a',fontWeight:'900'}}>{pr.price}</div><div style={{fontSize:'11px',color:'#666'}}>{pr.location}</div></div>)}</div>
{filtered.length===0&&<div style={{textAlign:'center',padding:'40px',color:'#888'}}>No results</div>}
{showProfile&&user&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:30}}><div style={{background:'#fff',width:'100%',maxWidth:'420px',borderRadius:'22px 22px 0 0',padding:'22px',display:'flex',flexDirection:'column',gap:'14px'}}><div style={{display:'flex',alignItems:'center',gap:'14px'}}><div style={{width:'64px',height:'64px',borderRadius:'50%',background:'#16a34a',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'26px',fontWeight:'bold'}}>{initial}</div><div><div style={{fontWeight:'900'}}>{user.name||'Chifuka'}</div><div style={{fontSize:'13px',color:'#555'}}>{userEmail}</div><div style={{fontSize:'11px',background:'#dcfce7',padding:'2px 8px',borderRadius:'10px',marginTop:'4px'}}>Verified ✓</div></div></div><button onClick={()=>{localStorage.removeItem('shopline_user');setUser(null);setShowProfile(false)}} style={{background:'#dc2626',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'bold'}}>Logout</button><button onClick={()=>setShowProfile(false)} style={{background:'#111',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'bold'}}>Close</button></div></div>}
{showLogin&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:20,padding:'16px'}}><div style={{background:'#fff',padding:'24px',borderRadius:'16px',width:'100%',maxWidth:'360px',display:'flex',flexDirection:'column',gap:'12px'}}><h2 style={{margin:0}}>Welcome Back</h2><input value={contact} onChange={e=>setContact(e.target.value)} placeholder='Email or Phone' style={{padding:'14px',borderRadius:'12px',border:'1px solid #ccc'}}/><div style={{position:'relative'}}><input value={pass} onChange={e=>setPass(e.target.value)} type={showPass?'text':'password'} placeholder='Password' style={{padding:'14px',paddingRight:'44px',borderRadius:'12px',border:'1px solid #ccc',width:'100%',boxSizing:'border-box'}}/><span onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',cursor:'pointer'}}>{showPass?'🙈':'👁️'}</span></div><button onClick={login} disabled={loading} style={{background:'#16a34a',color:'#fff',padding:'14px',borderRadius:'12px',border:'none',fontWeight:'bold'}}>{loading?'Wait...':'Log In / Sign Up'}</button><button onClick={()=>setShowLogin(false)} style={{background:'#f3f4f6',padding:'14px',borderRadius:'12px',border:'none'}}>Cancel</button></div></div>}
{showVerify&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:'16px'}}><div style={{background:'#fff',padding:'24px',borderRadius:'18px',width:'100%',maxWidth:'360px',display:'flex',flexDirection:'column',gap:'14px',textAlign:'center'}}><div style={{fontSize:'40px'}}>📲</div><h2 style={{margin:0}}>Verify Account</h2><p style={{margin:0,fontSize:'13px',lineHeight:'18px'}}>Code sent to <b>{pendingUser?.phone||pendingUser?.email}</b><br/><span style={{background:'#dcfce7',padding:'6px 12px',borderRadius:'8px',fontWeight:'900',fontSize:'16px',marginTop:'8px',display:'inline-block',border:'2px solid #16a34a'}}>CODE: {generatedCode}</span></p><input value={verifyInput} onChange={e=>setVerifyInput(e.target.value)} placeholder='6-digit code' maxLength={6} style={{padding:'16px',borderRadius:'12px',border:'2px solid #16a34a',fontSize:'22px',textAlign:'center',letterSpacing:'6px',fontWeight:'bold'}}/><button onClick={confirmVerify} disabled={loading||verifyInput.length<6} style={{background:verifyInput.length===6?'#16a34a':'#9ca3af',color:'#fff',padding:'14px',borderRadius:'12px',border:'none',fontWeight:'bold',fontSize:'16px'}}>{loading?'Verifying...':'Verify & Create'}</button><button onClick={()=>{setShowVerify(false);setShowLogin(true)}} style={{background:'#111',color:'#fff',padding:'14px',borderRadius:'12px',border:'none',fontWeight:'bold',fontSize:'15px'}}>Back</button></div></div>}
{showSell&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:20,padding:'16px'}}><div style={{background:'#fff',padding:'20px',borderRadius:'16px',width:'100%',maxWidth:'360px',display:'flex',flexDirection:'column',gap:'10px'}}><h3 style={{margin:0}}>Sell Item</h3><input type='file' accept='image/*' onChange={handleImg}/>{img&&<img src={img} style={{height:'90px',objectFit:'cover',borderRadius:'8px'}}/>}<input value={t} onChange={e=>setT(e.target.value)} placeholder='Title'/><select value={nc} onChange={e=>setNc(e.target.value)}>{cats.filter(c=>c.id!=='All'&&c.id!=='Trending').map(c=><option key={c.id} value={c.id}>{c.i} {c.l}</option>)}</select><input value={p} onChange={e=>setP(e.target.value)} placeholder='Price'/><div style={{display:'flex',gap:'8px'}}><input value={loc} onChange={e=>setLoc(e.target.value)} placeholder='City' style={{flex:1}}/><select value={nCountry} onChange={e=>setNCountry(e.target.value)} style={{flex:1}}>{countries.filter(c=>c!=='All Countries').map(c=><option key={c} value={c}>{c}</option>)}</select></div><button onClick={sell} style={{background:'#16a34a',color:'#fff',padding:'14px',borderRadius:'10px',border:'none',fontWeight:'bold'}}>Post FREE</button><button onClick={()=>setShowSell(false)} style={{background:'#eee',padding:'12px',borderRadius:'8px',border:'none'}}>Cancel</button></div></div>}
</div>)}

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://kfusttbmgbxklwnexdyk.supabase.co','sb_publishable_XGyHpQhM0l2YLZPrQSqSSg_I0axJuXd')
export default function App(){
const cats=[
{id:'All',l:'All',i:'★'},
{id:'Trending',l:'Trending',i:'🔥'},
{id:'Phones',l:'Phones',i:'📱'},
{id:'Laptops',l:'Laptops',i:'💻'},
{id:'Electronics',l:'Electronics',i:'🔌'},
{id:'Fashion Men',l:'Men',i:'👕'},
{id:'Fashion Women',l:'Women',i:'👗'},
{id:'Shoes',l:'Shoes',i:'👟'},
{id:'Beauty',l:'Beauty',i:'💄'},
{id:'Home',l:'Home',i:'🏠'},
{id:'Vehicles',l:'Vehicles',i:'🚗'},
{id:'Property',l:'Property',i:'🏢'},
{id:'Food',l:'Food',i:'🍎'},
{id:'Livestock',l:'Livestock',i:'🐄'},
{id:'Farming',l:'Farming',i:'🌾'},
{id:'Services',l:'Services',i:'🔧'},
{id:'Jobs',l:'Jobs',i:'💼'},
{id:'Kids',l:'Kids',i:'👶'},
{id:'Sports',l:'Sports',i:'⚽'},
{id:'Books',l:'Books',i:'📚'},
{id:'Pets',l:'Pets',i:'🐶'},
]
const [user,setUser]=useState(null)
const [contact,setContact]=useState('')
const [pass,setPass]=useState('')
const [showLogin,setShowLogin]=useState(false)
const [showSell,setShowSell]=useState(false)
const [loading,setLoading]=useState(false)
const [cat,setCat]=useState('All')
const [products,setProducts]=useState([
{id:1,title:'iPhone 14 Pro',price:'K12,500',location:'Lusaka',cat:'Phones',image:''},
{id:2,title:'Nike Shoes',price:'K850',location:'Ndola',cat:'Shoes',image:''},
{id:3,title:'Tomatoes 10kg',price:'K200',location:'Chipata',cat:'Food',image:''},
{id:4,title:'Toyota Corolla',price:'K85,000',location:'Lusaka',cat:'Vehicles',image:''}
])
const [t,setT]=useState('')
const [p,setP]=useState('')
const [loc,setLoc]=useState('')
const [img,setImg]=useState('')
const [nc,setNc]=useState('Phones')
useEffect(()=>{const s=localStorage.getItem('shopline_user');if(s)setUser(JSON.parse(s))},[])
const getI=()=>{if(!user)return 'C';return (user.name||'C')[0].toUpperCase()}
const handleImg=(e)=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>setImg(r.result);r.readAsDataURL(f)}
const login=async()=>{if(!contact||!pass)return alert('Enter login');setLoading(true);try{const isPhone=!contact.includes('@');const v=contact.trim();let found=null;if(isPhone){const {data}=await supabase.from('users').select('*').eq('phone',v).eq('password',pass).maybeSingle();if(data)found=data;else{const {data:d2}=await supabase.from('users').select('*').eq('email',v+'@phone.shopline').eq('password',pass).maybeSingle();if(d2)found=d2}}else{const {data}=await supabase.from('users').select('*').eq('email',v).eq('password',pass).maybeSingle();if(data)found=data}if(found){localStorage.setItem('shopline_user',JSON.stringify(found));setUser(found);setShowLogin(false)}else{const nd=isPhone?{phone:v,email:v+'@phone.shopline',password:pass,name:'Chifuka'}:{email:v,phone:v,password:pass,name:v.split('@')[0]};const {data:nu,error}=await supabase.from('users').insert([nd]).select().single();if(error)alert(error.message);else{localStorage.setItem('shopline_user',JSON.stringify(nu));setUser(nu);setShowLogin(false)}}}catch(e){alert(e.message)}setLoading(false)}
const sell=()=>{if(!t||!p)return alert('Add title price');const np={id:Date.now(),title:t,price:p.startsWith('K')?p:'K'+p,location:loc||'Lusaka',cat:nc,image:img};setProducts([np,...products]);setT('');setP('');setLoc('');setImg('');setShowSell(false)}
const filtered=cat==='All'?products:cat==='Trending'?products.slice(0,6):products.filter(x=>x.cat===cat)
const initial=getI()
return(
<div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'Arial'}}>
<header style={{background:'#fff',borderBottom:'1px solid #eee',position:'sticky',top:0,zIndex:10}}><div style={{display:'flex',justifyContent:'space-between',padding:'10px 12px',alignItems:'center'}}><div style={{color:'#16a34a',fontWeight:900,lineHeight:'14px'}}>SHOPLINE<br/>MARKET</div><div style={{display:'flex',gap:'8px',alignItems:'center'}}>{user?<><button onClick={()=>setShowSell(true)} style={{background:'#16a34a',color:'#fff',border:'none',padding:'10px 14px',borderRadius:'10px',fontWeight:'bold'}}>+ Sell</button><div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#111',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold'}}>{initial}</div><button onClick={()=>{localStorage.removeItem('shopline_user');setUser(null)}} style={{background:'#fee2e2',border:'none',padding:'8px',borderRadius:'8px'}}>Logout</button></>:<button onClick={()=>setShowLogin(true)} style={{background:'#16a34a',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'10px',fontWeight:'bold'}}>Log In</button>}</div></div></header>
<div style={{background:'linear-gradient(135deg,#16a34a,#22c55e)',color:'#fff',padding:'14px',maxWidth:'700px',margin:'0 auto'}}><div style={{fontWeight:'bold'}}>{user?`Welcome back, ${user.name||'Chifuka'}!`:'Welcome to Shopline Market!'}</div><div style={{fontSize:'12px',marginTop:'4px'}}>{filtered.length} items - Buy and Sell Anything</div></div>
<div style={{background:'#fff',padding:'10px',display:'flex',gap:'8px',overflowX:'auto',maxWidth:'700px',margin:'0 auto',borderBottom:'1px solid #eee'}}>{cats.map(c=><button key={c.id} onClick={()=>setCat(c.id)} style={{background:cat===c.id?'#111':'#f3f4f6',color:cat===c.id?'#fff':'#111',border:'none',padding:'7px 12px',borderRadius:'18px',fontSize:'12px',fontWeight:'bold',flexShrink:0}}>{c.i} {c.l}</button>)}</div>
<div style={{padding:'10px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',maxWidth:'700px',margin:'0 auto'}}>{filtered.map(pr=><div key={pr.id} style={{background:'#fff',padding:'8px',borderRadius:'12px',border:'1px solid #eee'}}><div style={{background:'#f1f5f9',height:'100px',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px'}}>{pr.image?<img src={pr.image} style={{width:'100%',height:'100px',objectFit:'cover',borderRadius:'8px'}}/>:cats.find(x=>x.id===pr.cat)?.i||'📦'}</div><div style={{fontSize:'10px',background:'#f3f4f6',display:'inline-block',padding:'2px 6px',borderRadius:'8px',marginTop:'4px'}}>{pr.cat}</div><div style={{fontWeight:'bold',fontSize:'12px',marginTop:'4px',height:'28px',overflow:'hidden'}}>{pr.title}</div><div style={{color:'#16a34a',fontWeight:'bold',fontSize:'13px'}}>{pr.price}</div><div style={{fontSize:'10px',color:'#666'}}>{pr.location}</div></div>)}</div>
{showLogin&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:20,padding:'16px'}}><div style={{background:'#fff',padding:'20px',borderRadius:'14px',width:'100%',maxWidth:'340px',display:'flex',flexDirection:'column',gap:'10px'}}><h3 style={{margin:0}}>Log In</h3><input value={contact} onChange={e=>setContact(e.target.value)} placeholder='Email or Phone' style={{padding:'12px',borderRadius:'8px',border:'1px solid #ccc'}}/><input value={pass} onChange={e=>setPass(e.target.value)} type='password' placeholder='Password' style={{padding:'12px',borderRadius:'8px',border:'1px solid #ccc'}}/><button onClick={login} disabled={loading} style={{background:'#16a34a',color:'#fff',padding:'12px',borderRadius:'8px',border:'none',fontWeight:'bold'}}>{loading?'Wait...':'Log In'}</button><button onClick={()=>setShowLogin(false)} style={{background:'#eee',padding:'10px',borderRadius:'8px',border:'none'}}>Cancel</button></div></div>}
{showSell&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:20,padding:'16px'}}><div style={{background:'#fff',padding:'20px',borderRadius:'14px',width:'100%',maxWidth:'340px',display:'flex',flexDirection:'column',gap:'10px'}}><h3 style={{margin:0}}>Add Product</h3><input type='file' accept='image/*' onChange={handleImg}/>{img&&<img src={img} style={{height:'80px',objectFit:'cover',borderRadius:'8px'}}/>}<input value={t} onChange={e=>setT(e.target.value)} placeholder='Title' style={{padding:'10px',borderRadius:'8px',border:'1px solid #ccc'}}/><select value={nc} onChange={e=>setNc(e.target.value)} style={{padding:'10px',borderRadius:'8px',border:'1px solid #ccc'}}>{cats.filter(c=>c.id!=='All'&&c.id!=='Trending').map(c=><option key={c.id} value={c.id}>{c.i} {c.l}</option>)}</select><input value={p} onChange={e=>setP(e.target.value)} placeholder='Price' style={{padding:'10px',borderRadius:'8px',border:'1px solid #ccc'}}/><input value={loc} onChange={e=>setLoc(e.target.value)} placeholder='Location' style={{padding:'10px',borderRadius:'8px',border:'1px solid #ccc'}}/><button onClick={sell} style={{background:'#16a34a',color:'#fff',padding:'12px',borderRadius:'8px',border:'none',fontWeight:'bold'}}>Post Free</button><button onClick={()=>setShowSell(false)} style={{background:'#eee',padding:'10px',borderRadius:'8px',border:'none'}}>Cancel</button></div></div>}
</div>)}

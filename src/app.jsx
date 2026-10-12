import React, {useState,useEffect} from 'react'
import {supabase} from './lib/supabase.js'
const CATS=['All','Phones','Clothes','Shoes','Bags','Beauty','Electronics','Home','Cars','Property','Jobs','Services','Food','Kids','Other']
export default function App(){
const [page,setPage]=useState('home')
const [user,setUser]=useState(null)
const [products,setProducts]=useState([])
const [name,setName]=useState('')
const [price,setPrice]=useState('')
const [img,setImg]=useState('')
const [cat,setCat]=useState('Phones')
const [show,setShow]=useState(false)
const [search,setSearch]=useState('')
const [scat,setScat]=useState('All')
const [email,setEmail]=useState('')
const [pass,setPass]=useState('')
const [mode,setMode]=useState('login')
useEffect(()=>{supabase.auth.getSession().then(({data})=>setUser(data.session?.user||null));supabase.auth.onAuthStateChange((_,s)=>setUser(s?.user||null));load()},[])
async function load(){const {data}=await supabase.from('products').select('*').order('id',{ascending:false});if(data)setProducts(data)}
async function add(e){e.preventDefault();if(!user)return setPage('auth');const {error}=await supabase.from('products').insert([{name,price:Number(price),image_url:img,category:cat,seller_id:user.id,seller_name:user.email.split('@')[0]}]);if(error)alert(error.message);else{setName('');setPrice('');setImg('');load();setShow(false);setPage('dash')}}
const list=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())&&(scat==='All'||p.category===scat))
return(<>
<header style={{background:'#fff',borderBottom:'1px solid #eee',position:'sticky',top:0,zIndex:10}}><div style={{maxWidth:1100,margin:'0 auto',padding:'10px 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><div onClick={()=>setPage('home')} style={{display:'flex',gap:8,alignItems:'center',cursor:'pointer'}}><div style={{width:36,height:36,background:'#16a34a',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center'}}>🛍️</div><b style={{color:'#15803d'}}>Shopline</b></div><div style={{display:'flex',gap:6}}>{user?<><button onClick={()=>setPage('dash')} style={{background:'#000',color:'#fff',padding:'8px 12px',borderRadius:999,border:0}}>Dashboard</button><button onClick={()=>supabase.auth.signOut()} style={{background:'#eee',padding:'8px 10px',borderRadius:999,border:0}}>Logout</button></>:<button onClick={()=>setPage('auth')} style={{background:'#16a34a',color:'#fff',padding:'8px 14px',borderRadius:999,border:0,fontWeight:700}}>Login</button>}</div></div></header>
{page==='home'&&<div style={{background:'#f0fdf4',padding:14,minHeight:'100vh'}}><div style={{maxWidth:1100,margin:'0 auto'}}><h1 style={{textAlign:'center',fontSize:28,fontWeight:900,margin:'10px 0 4px'}}>Welcome to <span style={{color:'#16a34a'}}>Shopline</span></h1><p style={{textAlign:'center',color:'#666',fontSize:13}}>{products.length} products - Open to everyone</p><div style={{display:'flex',justifyContent:'center',marginTop:10}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search phones, cars, jobs..." style={{padding:'10px 16px',borderRadius:999,border:'1px solid #ddd',width:'90%',maxWidth:360}}/></div><div style={{display:'flex',gap:6,flexWrap:'wrap',justifyContent:'center',marginTop:12}}>{CATS.map(c=><button key={c} onClick={()=>setScat(c)} style={{padding:'6px 10px',borderRadius:999,border:'1px solid #ddd',background:scat===c?'#16a34a':'#fff',color:scat===c?'#fff':'#333',fontSize:12,fontWeight:600}}>{c}</button>)}</div><div style={{background:'#fffbe6',border:'1px dashed #f59e0b',borderRadius:10,padding:8,textAlign:'center',marginTop:12,fontSize:11}}>Ad Space - Google AdSense earns you $$$</div><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:10,marginTop:12}}>{list.map(p=><div key={p.id} style={{background:'#fff',borderRadius:16,overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}><img src={p.image_url} alt={p.name} style={{width:'100%',height:130,objectFit:'cover',background:'#f3f4f6'}}/><div style={{padding:10}}><span style={{fontSize:9,background:'#dcfce7',color:'#166534',padding:'2px 6px',borderRadius:999}}>{p.category}</span><div style={{fontWeight:800,fontSize:12,marginTop:4,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</div><div style={{fontWeight:900,marginTop:2}}>${Number(p.price||0).to

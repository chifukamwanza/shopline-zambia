import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://kfusttbmgbxklwnexdyk.supabase.co','sb_publishable_XGyHpQhM0l2YLZPrQSqSSg_I0axJuXd')

export default function App(){
const categories=[
  {id:'All', label:'All', icon:'✨'},
  {id:'Trending', label:'Trending', icon:'🔥'},
  {id:'Phones', label:'Phones', icon:'📱'},
  {id:'Laptops', label:'Laptops', icon:'💻'},
  {id:'Electronics', label:'Electronics', icon:'🔌'},
  {id:'Fashion Men', label:'Men Fashion', icon:'👕'},
  {id:'Fashion Women', label:'Women Fashion', icon:'👗'},
  {id:'Shoes', label:'Shoes', icon:'👟'},
  {id:'Beauty', label:'Beauty', icon:'💄'},
  {id:'Home', label:'Home & Garden', icon:'🏠'},
  {id:'Vehicles', label:'Vehicles', icon:'🚗'},
  {id:'Property', label:'Property', icon:'🏘️'},
  {id:'Food', label:'Food', icon:'🍅'},
  {id:'Livestock', label:'Livestock', icon:'🐄'},
  {id:'Agriculture', label:'Agriculture', icon:'🌾'},
  {id:'Services', label:'Services', icon:'🛠️'},
  {id:'Jobs', label:'Jobs', icon:'💼'},
  {id:'Kids', label:'Babies & Kids', icon:'🧒'},
  {id:'Sports', label:'Sports', icon:'⚽'},
  {id:'Books', label:'Books', icon:'📚'},
  {id:'Pets', label:'Pets', icon:'🐶'},
];

const [user,setUser]=useState(null);const[contact,setContact]=useState('');const[pass,setPass]=useState('');const[showPass,setShowPass]=useState(false);const[showLogin,setShowLogin]=useState(false);const[showProfile,setShowProfile]=useState(false);const[showSell,setShowSell]=useState(false);const[loading,setLoading]=useState(false);const[cat,setCat]=useState('All');
const[products,setProducts]=useState([
  {id:1,title:'iPhone 14 Pro Max 256GB',price:'K12,500',location:'Lusaka',seller:'Chifuka',image:'',cat:'Phones'},
  {id:2,title:'Nike Air Max Shoes',price:'K850',location:'Ndola',seller:'Sneaker Hub',image:'',cat:'Shoes'},
  {id:3,title:'Fresh Tomatoes 10kg',price:'K200',location:'Chipata',seller:'Farmer',image:'',cat:'Food'},
  {id:4,title:'Toyota Corolla 2015',price:'K85,000',location:'Lusaka',seller:'Auto Deal',image:'',cat:'Vehicles'},
]);
const[newTitle,setNewTitle]=useState('');const[newPrice,setNewPrice]=useState('');const[newLocation,setNewLocation]=useState('');const[newImage,setNewImage]=useState('');const[newCat,setNewCat]=useState('Phones');
const[showChat,setShowChat]=useState(false);const[chatProduct,setChatProduct]=useState(null);const[chatMsg,setChatMsg]=useState('');const[chats,setChats]=useState({});

useEffect(()=>{const s=localStorage.getItem('shopline_user');if(s)setUser(JSON.parse(s));const p=localStorage.getItem('shopline_products');if(p)setProducts(JSON.parse(p));const c=localStorage.getItem('shopline_chats');if(c)setChats(JSON.parse(c))},[])

const getInitial=()=>{if(!user)return 'C';let n=user.name||'';let letters=n.replace(/[^A-Za-z]/g,'');if(letters.length>0)return letters[0].toUpperCase();return 'C'}
const handleImage=(e)=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>setNewImage(r.result);r.readAsDataURL(file)}
const handleLogin=async()=>{
if(!contact||!pass)return alert('Enter email/phone');setLoading(true);
try{const isPhone=!contact.includes('@');const v=contact.trim();let found=null;if(isPhone){let{data}=await supabase.from('users').select('*').eq('phone',v).eq('password',pass).maybeSingle();if(data)found=data;else{let{data:d2}=await supabase.from('users').select('*').eq('email',v+'@phone.shopline').eq('password',pass).maybeSingle();if(d2)found=d2}}else{let{data}=await supabase.from('users').select('*').eq('email',v).eq('password',pass).maybeSingle();if(data)found=data}
if(found){localStorage.setItem('shopline_user',JSON.stringify(found));setUser(found);setShowLogin(false);setContact('');setPass('')}else{const nd=isPhone?{phone:v,email:v+'@phone.shopline',password:pass,name:'Chifuka'}:{email:v,phone:v,password:pass,name:v.split('@')[0]};let{data:nu,[STRIPPED] supabase.from('users').insert([nd]).select().single();if(error)alert(error.message);else{localStorage.setItem('shopline_user',JSON.stringify(nu));setUser(nu);setShowLogin(false);setContact('');setPass('')}}}catch(e){alert(e.message)}setLoading(false)
}
const handleLogout=()=>{localStorage.removeItem('shopline_user');setUser(null);setShowProfile(false)}
const handleSell=()=>{if(!newTitle||!newPrice)return alert('Add title and price');if(!user)return alert('Login first');const np={id:Date.now(),title:newTitle,price:newPrice.startsWith('K')?newPrice:'K'+newPrice,location:newLocation||'Lusaka',seller:user.email||user.phone,image:newImage,cat:newCat};const up=[np,...products];setProducts(up);localStorage.setItem('shopline_products',JSON.stringify(up));setNewTitle('');setNewPrice('');setNewLocation('');setNewImage('');setShowSell(false)}
const openChat=(p)=>{if(!user)return alert('Login to chat');setChatProduct(p);setShowChat(true)}
const sendChat=()=>{if(!chatMsg.trim())return;const id=chatProduct.id;const all={...chats};if(!all[id])all[id]=[];all[id].push({from:user.email||user.phone,text:chatMsg,time:new Date().toLocaleTimeString()});setChats(all);localStorage.setItem('shopline_chats',JSON.stringify(all));setChatMsg('')}

const initial=getInitial();
const filtered=cat==='All'?products:cat==='Trending'?products.slice(0,6):products.filter(p=>p.cat===cat);
const userName=user?(user.name||'Chifuka'):'Friend';

return(<div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'Arial'}}>
<header style={{background:'#fff',borderBottom:'1px solid #eee',position:'sticky',top:0,zIndex:10}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 12px'}}><div style={{lineHeight:'15px'}}><div style={{color:'#16a34a',fontWeight:900}}>SHOPLINE</div><div style={{color:'#16a34a',fontWeight:900}}>MARKET</div></div><div style={{display:'flex',alignItems:'center',gap:'8px'}}>{user?<><button onClick={()=>setShowSell(true)} style={{background:'#16a34a',color:'#fff',border:'none',padding:'11px 16px',borderRadius:'12px',fontWeight:'bold'}}>+ Sell Free</button><div onClick={()=>setShowProfile(true)} style={{width:'40px',height:'40px',borderRadius:'50%',background:'#111',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',cursor:'pointer'}}>{initial}</div></>:<button onClick={()=>setShowLogin(true)} style={{background:'#16a34a',color:'#fff',border:'none',padding:'11px 18px',borderRadius:'12px',fontWeight:'bold'}}>Log In</button>}</div></div></header>

<div style={{background:'linear-gradient(135deg,#16a34a,#22c55e)',color:'#fff',padding:'16px 12px',maxWidth:'700px',margin:'0 auto'}}>
<div style={{fontSize:'18px',fontWeight:'bold'}}>{user?`Welcome back, ${userName}! 👋`:'Welcome to Shopline Market! 👋'}</div>
<div style={{fontSize:'13px',marginTop:'4px',opacity:0.95}}>{user?`Discover trending deals near you. ${filtered.length} items waiting.`:'Buy & Sell Anything, Anywhere — Free, Fast & Trusted 🌍'}</div>
</div>

<div style={{background:'#fff',padding:'12px',display:'flex',gap:'10px',overflowX:'auto',whiteSpace:'nowrap',maxWidth:'700px',margin:'0 auto',borderBottom:'1px solid #eee'}}>
{categories.map(c=><button key={c.id} onClick={()=>setCat(c.id)} style={{background:cat===c.id?'#111':'#fff',color:cat===c.id?'#fff':'#333',border:cat===c.id?'none':'1px solid #e5e7eb',padding:'9px 14px',borderRadius:'20px',fontSize:'13px',fontWeight:'bold',flexShrink:0,display:'flex',alignItems:'center',gap:'4px'}}><span>{c.icon}</span>{c.label}</button>)}
</div>

<div style={{padding:'12px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',maxWidth:'700px',margin:'0 auto'}}>
{filtered.map(p=><div key={p.id} style={{background:'#fff',padding:'10px',borderRadius:'14px',border:'1px solid #eee'}}>{p.image?<img src={p.image} style={{width:'100%',height:'120px',objectFit:'cover',borderRadius:'10px'}}/>:<div style={{background:'#f1f5f9',height:'120px',borderRadius:'10px',display:'flex',alignItems:'center',justifyContent:'center',color:'#16a34a',fontWeight:'bold'}}>{categories.find(x=>x.id===p.cat)?.icon||'📦'}</div>}<div style={{marginTop:'4px',fontSize:'10px',background:'#f3f4f6',display:'inline-block',padding:'2px 6px',borderRadius:'10px'}}>{p.cat}</div><div style={{marginTop:'4px',fontWeight:'bold',fontSize:'13px',height:'30px',overflow:'hidden'}}>{p.title}</div><div style={{color:'#16a34a',fontWeight:'bold'}}>{p.price}</div><div style={{fontSize:'11px',color:'#666'}}>{p.location}</div><button onClick={()=>openChat(p)} style={{marginTop:'6px',width:'100%',background:'#111',color:'#fff',border:'none',padding:'8px',borderRadius:'8px',fontSize:'12px',fontWeight:'bold'}}>💬 Chat Seller</button></div>)}
</div>
{filtered.length===0&&<div style={{textAlign:'center',padding:'40px',color:'#888'}}>No items in {cat} yet.<br/>Be the first to sell!</div>}

{showProfile&&user&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:30}}><div style={{background:'#fff',width:'100%',maxWidth:'420px',borderRadius:'20px 20px 0 0',padding:'20px',display:'flex',flexDirection:'column',gap:'12px'}}><div style={{width:'40px',height:'5px',background:'#ddd',borderRadius:'10px',alignSelf:'center'}}/><div style={{display:'flex',alignItems:'center',gap:'12px'}}><div style={{width:'60px',height:'60px',borderRadius:'50%',background:'#16a34a',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'24px',fontWeight:'bold'}}>{initial}</div><div><div style={{fontWeight:'bold'}}>{userName}</div><div style={{fontSize:'13px',color:'#555'}}>{(user.email||'').replace('@phone.shopline','')||user.phone}</div></div></div><button onClick={handleLogout} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'bold'}}>Logout</button><button onClick={()=>setShowProfile(false)} style={{background:'#111',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'bold'}}>Close</button></div></div>}

{showLogin&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:20,padding:'16px'}}><div style={{background:'#fff',padding:'24px',borderRadius:'16px',width:'100%',maxWidth:'360px',display:'flex',flexDirection:'column',gap:'12px'}}><h2 style={{margin:0}}>Log In</h2><input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Email or Phone" style={{padding:'14px',borderRadius:'12px',border:'1px solid #ccc'}}/><div style={{position:'relative'}}><input value={pass} onChange={e=>setPass(e.target.value)} type={showPass?'text':'password'} placeholder="Password" style={{padding:'14px',paddingRight:'45px',borderRadius:'12px',border:'1px solid #ccc',width:'100%',boxSizing:'border-box'}}/><span onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'14px',top:'50%',transform:'translateY(-50%)',cursor:'pointer'}}>{showPass?'🙈':'👁️'}</span></div><button onClick={handleLogin} disabled={loading} style={{background:'#16a34a',color:'#fff',padding:'14px',borderRadius:'12px',border:'none',fontWeight:'bold'}}>{loading?'Wait...':'Log In'}</button><button onClick={()=>setShowLogin(false)} style={{background:'#f3f4f6',padding:'14px',borderRadius:'12px',border:'none'}}>Cancel</button></div></div>}

{showSell&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:20,padding:'16px'}}><div style={{background:'#fff',padding:'24px',borderRadius:'16px',width:'100%',maxWidth:'360px',display:'flex',flexDirection:'column',gap:'12px',maxHeight:'90vh',overflowY:'auto'}}><h2 style={{margin:0}}>Add Product</h2><input type="file" accept="image/*" onChange={handleImage} style={{padding:'10px',border:'1px solid #ccc',borderRadius:'8px'}}/>{newImage&&<img src={newImage} style={{width:'100%',height:'120px',objectFit:'cover',borderRadius:'8px'}}/>}<input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Title e.g. iPhone 13" style={{padding:'12px',borderRadius:'8px',border:'1px solid #ccc'}}/><select value={newCat} onChange={e=>setNewCat(e.target.value)} style={{padding:'12px',borderRadius:'8px',border:'1px solid #ccc'}}>{categories.filter(c=>c.id!=='All'&&c.id!=='Trending').map(c=><option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}</select><input value={newPrice} onChange={e=>setNewPrice(e.target.value)} placeholder="Price" style={{padding:'12px',borderRadius:'8px',border:'1px solid #ccc'}}/><input value={newLocation} onChange={e=>setNewLocation(e.target.value)} placeholder="Location" style={{padding:'12px',borderRadius:'8px',border:'1px solid #ccc'}}/><button onClick={handleSell} style={{background:'#16a34a',color:'#fff',padding:'14px',borderRadius:'10px',border:'none',fontWeight:'bold'}}>Post Now - Free</button><button onClick={()=>setShowSell(false)} style={{background:'#eee',padding:'12px',borderRadius:'8px',border:'none'}}>Cancel</button></div></div>}

{showChat&&chatProduct&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'flex-end',justifyContent:'center',zIndex:40}}><div style={{background:'#fff',width:'100%',maxWidth:'420px',height:'70vh',borderRadius:'20px 20px 0 0',display:'flex',flexDirection:'column'}}><div style={{padding:'16px',borderBottom:'1px solid #eee',display:'flex',justifyContent:'space-between'}}><b>💬 {chatProduct.title}</b><button onClick={()=>setShowChat(false)} style={{border:'none',background:'#eee',padding:'6px 12px',borderRadius:'8px'}}>X</button></div><div style={{flex:1,overflowY:'auto',padding:'12px',display:'flex',flexDirection:'column',gap:'8px'}}>{(chats[chatProduct.id]||[]).map((m,i)=><div key={i} style={{background:m.from===(user?.email||user?.phone)?'#dcfce7':'#f3f4f6',padding:'10px',borderRadius:'12px',alignSelf:m.from===(user?.email||user?.phone)?'flex-end':'flex-start',maxWidth:'80%'}}><div style={{fontSize:'12px'}}>{m.text}</div><div style={{fontSize:'10px',color:'#666'}}>{m.time}</div></div>)}{(!chats[chatProduct.id]||chats[chatProduct.id].length===0)&&<div style={{color:'#888',textAlign:'center',marginTop:'30px'}}>No messages yet. Say Hi! 👋</div>}</div><div style={{padding:'12px',borderTop:'1px solid #eee',display:'flex',gap:'8px'}}><input value={chatMsg} onChange={e=>setChatMsg(e.target.value)} placeholder="Type message..." style={{flex:1,padding:'12px',borderRadius:'20px',border:'1px solid #ccc'}}/><button onClick={sendChat} style={{background:'#16a34a',color:'#fff',border:'none',padding:'12px 18px',borderRadius:'20px',fontWeight:'bold'}}>Send</button></div></div></div>}

</div>)}

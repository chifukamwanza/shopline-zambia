import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'

const Logo = () => (
  <div style={{width:'42px',height:'42px',background:'linear-gradient(135deg,#16a34a,#15803d)',borderRadius:'12px',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden'}}>
    <span style={{fontSize:'22px'}}>🛍️</span>
    <div style={{position:'absolute',bottom:'6px',right:'8px',width:'18px',height:'5px',background:'#fb923c',borderRadius:'999px',transform:'rotate(-20deg)'}}></div>
  </div>
)

function App(){
  const [page,setPage]=useState('home')
  const [products,setProducts]=useState([])
  const [name,setName]=useState('')
  const [price,setPrice]=useState('')
  const [imageUrl,setImageUrl]=useState('')
  const [category,setCategory]=useState('Phones')
  const [sellerName,setSellerName]=useState('Shopline')
  const [showForm,setShowForm]=useState(false)
  const [search,setSearch]=useState('')
  const [selectedCat,setSelectedCat]=useState('All')
  const categories=['All','Phones','Clothes','Food','Electronics','Other']
  useEffect(()=>{fetchProducts()},[])
  function formatPrice(a){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:0}).format(a||0)}
  async function fetchProducts(){const {data}=await supabase.from('products').select('*').order('id',{ascending:false}); if(data) setProducts(data)}
  async function addProduct(e){e.preventDefault(); const {error}=await supabase.from('products').insert([{name,price:Number(price),image_url:imageUrl,category,seller_name:sellerName}]); if(error) alert(error.message); else{setName('');setPrice('');setImageUrl('');fetchProducts();setShowForm(false)}}
  async function deleteProduct(id){if(!confirm('Delete?')) return; await supabase.from('products').delete().eq('id',id); fetchProducts()}
  function orderWhatsApp(p){const msg=`Hello ${p.seller_name||'Shopline'}! I want to order ${p.name} for ${p.price} on Shopline - The Open Market\nProduct: ${p.name}\nPrice: ${p.price}\nSeller: ${p.seller_name||'Shopline'}`; window.open(`https://wa.me/260970757906?text=${encodeURIComponent(msg)}`,'_blank')}
  const filtered=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()) && (selectedCat==='All'||p.category===selectedCat))

  return(
    <>
    <style>{`@media(max-width:700px){.dash-form{grid-template-columns:1fr!important}.dash-header{flex-direction:column;align-items:flex-start!important;gap:12px}}`}</style>
    <header style={{background:'white',borderBottom:'1px solid #e5e7eb',position:'sticky',top:0,zIndex:50}}>
      <div style={{maxWidth:'1150px',margin:'0 auto',padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <Logo/>
          <div><div style={{fontWeight:'900',fontSize:'19px',lineHeight:1,color:'#15803d',letterSpacing:'-0.5px'}}>Shopline</div><div style={{fontWeight:'700',fontSize:'10px',color:'#16a34a',letterSpacing:'1.5px',textTransform:'uppercase'}}>Open Market</div></div>
        </div>
        <div style={{display:'flex',gap:'8px'}}>{page==='home'?<button onClick={()=>setPage('dashboard')} style={{background:'black',color:'white',padding:'9px 16px',borderRadius:'999px',border:'none',fontWeight:'700',fontSize:'13px'}}>Dashboard</button>:<button onClick={()=>setPage('home')} style={{background:'#f3f4f6',padding:'9px 16px',borderRadius:'999px',border:'none',fontWeight:'700',fontSize:'13px'}}>🏠 Shop</button>}</div>
      </div>
    </header>

    {page==='home'?(
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#f0fdf4,#ecfdf5)',padding:'16px'}}>
        <div style={{maxWidth:'1150px',margin:'0 auto'}}>
          <div style={{textAlign:'center',padding:'18px 0 8px'}}><h1 style={{fontSize:'30px',fontWeight:'900',margin:0}}>The World's Open <span style={{color:'#16a34a'}}>Market</span></h1><p style={{color:'#6b7280',fontSize:'13px',marginTop:'4px'}}>{products.length} products from sellers worldwide • Open to Everyone</p></div>
          <div style={{display:'flex',justifyContent:'center',gap:'10px',marginTop:'12px',flexWrap:'wrap'}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search anything..." style={{padding:'12px 18px',borderRadius:'999px',border:'1px solid #e5e7eb',width:'300px'}} /></div>
          <div style={{display:'flex',gap:'8px',justifyContent:'center',marginTop:'14px',flexWrap:'wrap'}}>{categories.map(cat=><button key={cat} onClick={()=>setSelectedCat(cat)} style={{padding:'7px 14px',borderRadius:'999px',border:'1px solid #e5e7eb',background:selectedCat===cat?'#16a34a':'white',color:selectedCat===cat?'white':'#374151',fontWeight:'600',fontSize:'13px'}}>{cat}</button>)}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'14px',marginTop:'22px'}}>{filtered.map(p=>(<div key={p.id} style={{background:'white',borderRadius:'18px',overflow:'hidden',boxShadow:'0 6px 18px rgba(0,0,0,0.06)',border:'1px solid #f3f4f6'}}>{p.image_url?<img src={p.image_url} style={{width:'100%',height:'150px',objectFit:'cover'}} />:<div style={{height:'150px',background:'#f9fafb',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px'}}>📦</div>}<div style={{padding:'12px'}}><div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'10px',background:'#dcfce7',color:'#166534',padding:'2px 7px',borderRadius:'999px',fontWeight:'700'}}>{p.category}</span><span style={{fontSize:'10px',color:'#6b7280'}}>👤 {p.seller_name?.split(' ')[0]||'Shopline'}</span></div><div style={{fontWeight:'800',marginTop:'6px',fontSize:'13px',lineHeight:'1.2'}}>{p.name}</div><div style={{fontWeight:'900',fontSize:'16px',marginTop:'4px'}}>{formatPrice(p.price)}</div><button onClick={()=>orderWhatsApp(p)} style={{width:'100%',background:'#25D366',color:'white',border:'none',padding:'10px',borderRadius:'10px',marginTop:'8px',fontWeight:'800',fontSize:'13px'}}>WhatsApp Order</button></div></div>))}</div>

          <footer style={{marginTop:'40px',background:'white',borderRadius:'20px',padding:'24px',border:'1px solid #e5e7eb'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'20px',maxWidth:'900px',margin:'0 auto'}}>
              <div><div style={{display:'flex',alignItems:'center',gap:'8px'}}><Logo/><span style={{fontWeight:'900',color:'#15803d'}}>Shopline</span></div><div style={{fontSize:'13px',color:'#6b7280',marginTop:'8px',lineHeight:1.5}}>The open market for everyone. Shop phones, clothes

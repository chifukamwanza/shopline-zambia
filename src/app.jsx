import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'

// LOGO IS BUILT-IN - NO FILE NEEDED!
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
  const [sellerName,setSellerName]=useState('Shopline Zambia')
  const [showForm,setShowForm]=useState(false)
  const [search,setSearch]=useState('')
  const [selectedCat,setSelectedCat]=useState('All')
  const categories=['All','Phones','Clothes','Food','Electronics','Other']
  useEffect(()=>{fetchProducts()},[])
  function formatKwacha(a){return new Intl.NumberFormat('en-ZM',{style:'currency',currency:'ZMW',minimumFractionDigits:0}).format(a||0).replace('ZMW','ZMW ')}
  async function fetchProducts(){const {data}=await supabase.from('products').select('*').order('id',{ascending:false}); if(data) setProducts(data)}
  async function addProduct(e){e.preventDefault(); const {error}=await supabase.from('products').insert([{name,price:Number(price),image_url:imageUrl,category,seller_name:sellerName}]); if(error) alert(error.message); else{setName('');setPrice('');setImageUrl('');fetchProducts();setShowForm(false)}}
  async function deleteProduct(id){if(!confirm('Delete?')) return; await supabase.from('products').delete().eq('id',id); fetchProducts()}
  function orderWhatsApp(p){const msg=`Hello ${p.seller_name||'Shopline'}! I want to order ${p.name} for ${formatKwacha(p.price)} from Shopline Zambia\nProduct: ${p.name}\nPrice: ${formatKwacha(p.price)}\nSeller: ${p.seller_name||'Shopline Zambia'}`; window.open(`https://wa.me/260970757906?text=${encodeURIComponent(msg)}`,'_blank')}
  const filtered=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()) && (selectedCat==='All'||p.category===selectedCat))

  return(
    <>
    <style>{`@media(max-width:700px){.dash-form{grid-template-columns:1fr!important}.dash-header{flex-direction:column;align-items:flex-start!important;gap:12px}}`}</style>
    <header style={{background:'white',borderBottom:'1px solid #e5e7eb',position:'sticky',top:0,zIndex:50}}>
      <div style={{maxWidth:'1150px',margin:'0 auto',padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <Logo/>
          <div><div style={{fontWeight:'900',fontSize:'18px',lineHeight:1,color:'#15803d'}}>Shopline</div><div style={{fontWeight:'800',fontSize:'12px',color:'#16a34a',letterSpacing:'0.5px'}}>ZAMBIA 🇿🇲</div></div>
        </div>
        <div style={{display:'flex',gap:'8px'}}>{page==='home'?<button onClick={()=>setPage('dashboard')} style={{background:'black',color:'white',padding:'9px 16px',borderRadius:'999px',border:'none',fontWeight:'700',fontSize:'13px'}}>Dashboard</button>:<button onClick={()=>setPage('home')} style={{background:'#f3f4f6',padding:'9px 16px',borderRadius:'999px',border:'none',fontWeight:'700',fontSize:'13px'}}>🏠 Shop</button>}</div>
      </div>
    </header>

    {page==='home'?(
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#f0fdf4,#ecfdf5)',padding:'16px'}}>
        <div style={{maxWidth:'1150px',margin:'0 auto'}}>
          <div style={{textAlign:'center',padding:'18px 0 8px'}}><h1 style={{fontSize:'30px',fontWeight:'900',margin:0}}>Shop Zambia's Best <span style={{color:'#16a34a'}}>Deals</span></h1><p style={{color:'#6b7280',fontSize:'13px',marginTop:'4px'}}>{products.length} products from Zambian SMEs • Pay on Delivery</p></div>
          <div style={{display:'flex',justifyContent:'center',gap:'10px',marginTop:'12px',flexWrap:'wrap'}}><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search phones, clothes..." style={{padding:'12px 18px',borderRadius:'999px',border:'1px solid #e5e7eb',width:'300px'}} /></div>
          <div style={{display:'flex',gap:'8px',justifyContent:'center',marginTop:'14px',flexWrap:'wrap'}}>{categories.map(cat=><button key={cat} onClick={()=>setSelectedCat(cat)} style={{padding:'7px 14px',borderRadius:'999px',border:'1px solid #e5e7eb',background:selectedCat===cat?'#16a34a':'white',color:selectedCat===cat?'white':'#374151',fontWeight:'600',fontSize:'13px'}}>{cat}</button>)}</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:'14px',marginTop:'22px'}}>{filtered.map(p=>(<div key={p.id} style={{background:'white',borderRadius:'18px',overflow:'hidden',boxShadow:'0 6px 18px rgba(0,0,0,0.06)',border:'1px solid #f3f4f6'}}>{p.image_url?<img src={p.image_url} style={{width:'100%',height:'150px',objectFit:'cover'}} />:<div style={{height:'150px',background:'#f9fafb',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'30px'}}>📦</div>}<div style={{padding:'12px'}}><div style={{display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'10px',background:'#dcfce7',color:'#166534',padding:'2px 7px',borderRadius:'999px',fontWeight:'700'}}>{p.category}</span><span style={{fontSize:'10px',color:'#6b7280'}}>👤 {p.seller_name?.split(' ')[0]||'Shopline'}</span></div><div style={{fontWeight:'800',marginTop:'6px',fontSize:'13px',lineHeight:'1.2'}}>{p.name}</div><div style={{fontWeight:'900',fontSize:'16px',marginTop:'4px'}}>{formatKwacha(p.price)}</div><button onClick={()=>orderWhatsApp(p)} style={{width:'100%',background:'#25D366',color:'white',border:'none',padding:'10px',borderRadius:'10px',marginTop:'8px',fontWeight:'800',fontSize:'13px'}}>WhatsApp Order</button></div></div>))}</div>

          <footer style={{marginTop:'40px',background:'white',borderRadius:'20px',padding:'24px',border:'1px solid #e5e7eb'}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:'20px',maxWidth:'900px',margin:'0 auto'}}>
              <div><div style={{display:'flex',alignItems:'center',gap:'8px'}}><Logo/><span style={{fontWeight:'900',color:'#15803d'}}>Shopline Zambia 🇿🇲</span></div><div style={{fontSize:'13px',color:'#6b7280',marginTop:'8px',lineHeight:1.5}}>Zambia's marketplace for SMEs. Shop phones, clothes, electronics with WhatsApp ordering.</div></div>
              <div><div style={{fontWeight:'800',fontSize:'13px'}}>Contact</div><div style={{fontSize:'13px',color:'#6b7280',marginTop:'6px'}}>📞 0970757906<br/>📍 Lusaka, Zambia<br/>✉️ hello@shoplinezambia.com</div></div>
              <div><div style={{fontWeight:'800',fontSize:'13px'}}>Sell on Shopline</div><div style={{fontSize:'13px',color:'#6b7280',marginTop:'6px'}}>Join 100+ sellers<br/>WhatsApp us to list<br/>No fees to start!</div></div>
            </div>
            <div style={{textAlign:'center',marginTop:'20px',paddingTop:'16px',borderTop:'1px solid #f3f4f6',fontSize:'11px',color:'#9ca3af'}}>© 2026 Shopline Zambia • Made with ❤️ for Zambian SMEs • Pay on Delivery • Fast Delivery</div>
          </footer>
        </div>
      </div>
    ):(
      <div style={{padding:'16px',background:'#f9fafb',minHeight:'100vh'}}>
        <div className="dash-header" style={{maxWidth:'1100px',margin:'0 auto 16px',display:'flex',justifyContent:'space-between',alignItems:'center'}}><h1 style={{fontWeight:'900',fontSize:'22px',margin:0,lineHeight:'1.2'}}>Dashboard<br/><span style={{color:'#16a34a',fontSize:'18px'}}>{formatKwacha(products.reduce((s,p)=>s+Number(p.price||0),0))} inventory</span></h1><button onClick={()=>setShowForm(!showForm)} style={{background:'black',color:'white',padding:'10px 18px',borderRadius:'999px',border:'none',fontWeight:'700'}}>+ Add Product</button></div>
        {showForm && (<div style={{maxWidth:'1100px',margin:'0 auto 16px',background:'white',padding:'14px',borderRadius:'16px'}}><form className="dash-form" onSubmit={addProduct} style={{display:'grid',gridTemplateColumns:'1fr 110px 1fr 1fr 120px 80px',gap:'8px'}}><input value={name} onChange={e=>setName(e.target.value)} placeholder="Product name" required style={{padding:'12px',borderRadius:'10px',border:'1px solid #e5e7eb'}} /><input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price" type="number" required style={{padding:'12px',borderRadius:'10px',border:'1px solid #e5e7eb'}} /><input value={imageUrl} onChange={e=>setImageUrl(e.target.value)} placeholder="Image URL" style={{padding:'12px',borderRadius:'10px',border:'1px solid #e5e7eb'}} /><input value={sellerName} onChange={e=>setSellerName(e.target.value)} placeholder="Seller" style={{padding:'12px',borderRadius:'10px',border:'1px solid #e5e7eb'}} /><select value={category} onChange={e=>setCategory(e.target.value)} style={{padding:'12px',borderRadius:'10px',border:'1px solid #e5e7eb'}}>{categories.filter(c=>c!=='All').map(c=><option key={c} value={c}>{c}</option>)}</select><button type="submit" style={{background:'#16a34a',color:'white',border:'none',borderRadius:'10px',fontWeight:'800'}}>Save</button></form></div>)}
        <div style={{maxWidth:'1100px',margin:'0 auto',display:'grid',gap:'10px'}}>{products.map(p=>(<div key={p.id} style={{background:'white',borderRadius:'14px',padding:'12px',display:'flex',gap:'12px',alignItems:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}><img src={p.image_url} style={{width:'56px',height:'56px',borderRadius:'10px',objectFit:'cover',background:'#f3f4f6'}} /><div style={{flex:1,minWidth:0}}><div style={{fontWeight:'800',fontSize:'14px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{p.name}</div><div style={{fontSize:'13px',color:'#6b7280'}}>{formatKwacha(p.price)} • {p.category} • {p.seller_name||'Shopline'}</div></div><button onClick={()=>deleteProduct(p.id)} style={{background:'#fee2e2',color:'#dc2626',border:'none',padding:'8px 12px',borderRadius:'8px',fontWeight:'700',fontSize:'12px'}}>Delete</button></div>))}</div>
      </div>
    )}
    </>
  )
}
export default App

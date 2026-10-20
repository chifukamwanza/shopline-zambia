import { useState, useEffect } from 'react'
import ProductCard from './components/ProductCard'
import AuthModal from './components/AuthModal'
import ProfileModal from './components/ProfileModal'

const CATS = ['All','Phones','Clothes','Shoes','Bags','Beauty','Electronics','Home','Cars','Property','Jobs','Services','Food','Kids','Other']
const SELL_CATS = ['Phones','Clothes','Shoes','Bags','Beauty','Electronics','Home','Cars','Property','Jobs','Services','Food','Kids','Other']
const COUNTRIES = ['Zambia','USA','Afghanistan','Albania','Algeria','Angola','Argentina','Australia','Austria','Belgium','Benin','Botswana','Brazil','Burkina Faso','Burundi','Cameroon','Canada','Chad','China','Colombia','Congo','Denmark','Egypt','Ethiopia','Finland','France','Germany','Ghana','India','Indonesia','Italy','Japan','Kenya','Malawi','Malaysia','Mexico','Morocco','Mozambique','Namibia','Nigeria','Portugal','Rwanda','South Africa','Spain','Tanzania','Turkey','Uganda','United Kingdom','Zimbabwe','Other']

const safeStorage = {
  read: (k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}},
  write: (k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
}

export default function App(){
  const [products,setProducts]=useState(()=>safeStorage.read('shopline_products',[
    {id:1,title:'Tekno spark 20',price:'K2,800',country:'Zambia',location:'Chipata',category:'Phones',image:'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd',owner:'demo@z.com',phone:'260978123456',description:'Good phone'},
    {id:2,title:'Bluetooth speaker',price:'K550',country:'Zambia',location:'Chipata',category:'Electronics',image:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1',owner:'other@z.com',phone:'260978123456',description:'Speaker'},
  ]))
  const [user,setUser]=useState(()=>safeStorage.read('shopline_user',null))
  const [showSell,setShowSell]=useState(false)
  const [showAuth,setShowAuth]=useState(false)
  const [showProfile,setShowProfile]=useState(false)
  const [search,setSearch]=useState('')
  const [cat,setCat]=useState('All')
  const [editing,setEditing]=useState(null)
  const [title,setTitle]=useState('')
  const [desc,setDesc]=useState('')
  const [price,setPrice]=useState('')
  const [sellCat,setSellCat]=useState('Phones')
  const [country,setCountry]=useState('Zambia')
  const [town,setTown]=useState('Chipata')
  const [image,setImage]=useState('')
  const [imgPreview,setImgPreview]=useState('')
  const [contact,setContact]=useState('')
  const [pass,setPass]=useState('')
  const [showPass,setShowPass]=useState(false)
  const [loading,setLoading]=useState(false)
  const [editName,setEditName]=useState('')
  const [editBio,setEditBio]=useState('')
  const [editCountry,setEditCountry]=useState('Zambia')
  const [editTown,setEditTown]=useState('')
  const [editPhone,setEditPhone]=useState('')
  const [editPic,setEditPic]=useState('')

  useEffect(()=>{safeStorage.write('shopline_products',products)},[products])
  useEffect(()=>{if(user)safeStorage.write('shopline_user',user); else try{localStorage.removeItem('shopline_user')}catch{}},[user])

  const handleImageUpload=(e)=>{const f=e.target.files?.[0]; if(!f)return; if(f.size>3*1024*1024){alert('Image <3MB');return} const r=new FileReader(); r.onload=()=>{setImage(r.result); setImgPreview(r.result)}; r.readAsDataURL(f)}
  const resetSell=()=>{setTitle('');setDesc('');setPrice('');setSellCat('Phones');setCountry('Zambia');setImage('');setImgPreview('');setEditing(null);setShowSell(false)}
  const handlePost=()=>{if(!title||!price){alert('Add title and price');return} if(!user){setShowAuth(true);return} const pr={id:editing?editing.id:Date.now(),title,description:desc,price:price.startsWith('K')?price:`K${price}`,country,location:town,category:sellCat,image:image||'https://via.placeholder.com/300',owner:user.email,phone:user.phone||editPhone}; if(editing)setProducts(products.map(p=>p.id===editing.id?pr:p)); else setProducts([pr,...products]); resetSell()}
  const onEdit=(pr)=>{setEditing(pr);setTitle(pr.title);setDesc(pr.description||'');setPrice(pr.price.replace(/K|,/g,''));setSellCat(pr.category||'Other');setCountry(pr.country||'Zambia');setTown(pr.location||'Chipata');setImage(pr.image);setImgPreview(pr.image);setShowSell(true)}
  const onDelete=(pr)=>{if(!confirm(`Delete ${pr.title}?`))return; setProducts(products.filter(p=>p.id!==pr.id))}
  const onLogin=()=>{if(!contact||!pass){alert('Fill fields');return} setLoading(true); setTimeout(()=>{const u={email:contact.includes('@')?contact:`${contact}@phone.zm`,name:contact.split('@')[0],pic:'',country:'Zambia',town:'Chipata',phone:contact,bio:''}; setUser(u); safeStorage.write('shopline_user',u); setShowAuth(false); setLoading(false)},600)}
  const openProfile=()=>{if(!user){setShowAuth(true);return} setEditName(user.name||'');setEditBio(user.bio||'');setEditCountry(user.country||'Zambia');setEditTown(user.town||'');setEditPhone(user.phone||'');setEditPic(user.pic||'');setShowProfile(true)}
  const saveProfile=()=>{setLoading(true); const nu={...user,name:editName,bio:editBio,country:editCountry,town:editTown,phone:editPhone,pic:editPic}; setTimeout(()=>{setUser(nu);safeStorage.write('shopline_user',nu);setLoading(false);setShowProfile(false)},500)}

  const filtered=products.filter(p=>{
    const s=(p.title+' '+(p.description||'')+' '+(p.category||'')).toLowerCase().includes(search.toLowerCase())
    const c=cat==='All' || (p.category||'').toLowerCase()===cat.toLowerCase() || p.title.toLowerCase().includes(cat.toLowerCase())
    return s && c
  })

  return (
    <div style={{minHeight:'100vh',background:'#f0f9f0',fontFamily:'system-ui'}}>
      <header style={{position:'sticky',top:0,zIndex:50,background:'#fff',padding:'10px 12px',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 1px 0 #e5e7eb'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',fontWeight:'900',fontSize:'20px',color:'#111'}}><span style={{background:'#22c55e',color:'#fff',width:'32px',height:'32px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>S</span>SHOPLINE</div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <button onClick={()=>{setCat('All'); window.scrollTo(0,0)}} style={{background:'#f3f4f6',color:'#111',border:'none',borderRadius:'20px',padding:'7px 16px',fontWeight:'700',fontSize:'13px'}}>Buy</button>
          <button onClick={()=>setShowSell(true)} style={{background:'#16a34a',color:'#fff',border:'none',borderRadius:'20px',padding:'7px 14px',fontWeight:'800',fontSize:'13px'}}>Join to Sell</button>
          <img onClick={openProfile} src={user?.pic||'https://via.placeholder.com/40'} style={{width:'32px',height:'32px',borderRadius:'50%',border:'2px solid #16a34a',objectFit:'cover'}} alt=""/>
        </div>
      </header>

      {/* PROFESSIONAL GLOBAL WELCOME - FIXED */}
      <div style={{margin:'10px 12px',background:'#fff',borderRadius:'16px',padding:'14px',textAlign:'center',border:'1px solid #e5e7eb',boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
        <div style={{fontSize:'16px',fontWeight:'900',color:'#111827'}}>Welcome to Shopline Global 🌍</div>
        <div style={{fontSize:'13px',color:'#6b7280',marginTop:'4px',lineHeight:'1.4'}}>The World's Open Market — Buy & Sell Anything, Anywhere.<br/><b>100% Free • Trusted • Instant WhatsApp Connect</b></div>
      </div>

      <div style={{padding:'0 14px'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{width:'100%',padding:'12px 18px',borderRadius:'30px',border:'1.5px solid #d1d5db',background:'#fff',color:'#000',outline:'none',fontSize:'14px'}}/>
      </div>

      <div style={{display:'flex',flexWrap:'wrap',gap:'6px',justifyContent:'center',padding:'12px 10px'}}>
        {CATS.map(c=> <button key={c} onClick={()=>setCat(c)} style={{padding:'6px 14px',borderRadius:'20px',border:'1px solid #e5e7eb',background:cat===c?'#16a34a':'#fff',color:cat===c?'#fff':'#111',fontWeight:cat===c?'800':'600',fontSize:'13px'}}>{c}</button>)}
      </div>

      <div style={{margin:'0 12px',border:'1.5px dashed #facc15',background:'#fffef0',borderRadius:'4px',padding:'8px',textAlign:'center',fontSize:'13px',color:'#6b7280'}}>📍 Ad Space</div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',padding:'12px'}}>
        {filtered.map(pr=> <ProductCard key={pr.id} pr={pr} user={user} onEdit={onEdit} onDelete={onDelete} />)}
      </div>

      {showSell && (
        <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
          <div style={{background:'#fff',width:'100%',maxWidth:'400px',borderRadius:'20px',padding:'20px',position:'relative',maxHeight:'90vh',overflowY:'auto'}}>
            <button onClick={resetSell} style={{position:'absolute',right:'14px',top:'14px',width:'32px',height:'32px',borderRadius:'50%',border:'1.5px solid #000',background:'#000',color:'#fff',fontWeight:'900'}}>×</button>
            <h3 style={{margin:'0 0 14px',fontSize:'19px',fontWeight:'900'}}>{editing?'Edit Product':'+ Sell Product'}</h3>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Product name" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #e5e7eb',marginBottom:'10px'}}/>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" rows={2} style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #e5e7eb',marginBottom:'10px',resize:'none'}}/>
            <select value={sellCat} onChange={e=>setSellCat(e.target.value)} style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #16a34a',marginBottom:'10px',background:'#f0fdf4',fontWeight:'700',color:'#111'}}>
              <option value="">-- Choose Category --</option>
              {SELL_CATS.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={country} onChange={e=>setCountry(e.target.value)} style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #2563eb',marginBottom:'10px',background:'#eff6ff',fontWeight:'700',color:'#111'}}>
              {COUNTRIES.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price e.g. 2800" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #e5e7eb',marginBottom:'10px'}}/>
            <input value={town} onChange={e=>setTown(e.target.value)} placeholder="Town e.g. Chipata" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #e5e7eb',marginBottom:'12px'}}/>
            <div style={{marginBottom:'14px'}}>{(imgPreview||image) && <img src={imgPreview||image} style={{width:'100%',height:'150px',objectFit:'cover',borderRadius:'12px',border:'2px solid #000',marginBottom:'8px'}} alt=""/>}<label style={{display:'block',padding:'12px',borderRadius:'12px',border:'2px dashed #000',background:'#f0fdf4',textAlign:'center',fontWeight:'800',cursor:'pointer'}}>📸 Upload Photo<input type="file" accept="image/*" onChange={handleImageUpload} style={{display:'none'}}/></label></div>
            <button onClick={handlePost} style={{width:'100%',padding:'14px',borderRadius:'14px',border:'none',background:'#16a34a',color:'#fff',fontWeight:'900',fontSize:'16px'}}>Post Product</button>
          </div>
        </div>
      )}
      {showAuth && <AuthModal contact={contact} setContact={setContact} pass={pass} setPass={setPass} showPass={showPass} setShowPass={setShowPass} onLogin={onLogin} onClose={()=>setShowAuth(false)} loading={loading} />}
      {showProfile && <ProfileModal user={user} editName={editName} setEditName={setEditName} editBio={editBio} setEditBio={setEditBio} editCountry={editCountry} setEditCountry={setEditCountry} editTown={editTown} setEditTown={setEditTown} editPhone={editPhone} setEditPhone={setEditPhone} editPic={editPic} setEditPic={setEditPic} onSave={saveProfile} onClose={()=>setShowProfile(false)} myAds={products.filter(p=>p.owner===user?.email).length} loading={loading} countries={COUNTRIES} />}
    </div>
  )
    }

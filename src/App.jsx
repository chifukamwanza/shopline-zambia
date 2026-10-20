import { useState, useEffect } from 'react'
import ProductCard from './components/ProductCard'
import AuthModal from './components/AuthModal'
import ProfileModal from './components/ProfileModal'

const CATS = ['All','Phones','Clothes','Electronics','Home']
const COUNTRIES = ['Zambia','USA','South Africa','Nigeria','Kenya','Other']

const safeStorage = {
  read: (key, def) => {
    try {
      const v = localStorage.getItem(key)
      return v ? JSON.parse(v) : def
    } catch { return def }
  },
  write: (key, val) => {
    try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
  }
}

export default function App(){
  const [products, setProducts] = useState(()=> safeStorage.read('shopline_products', [
    {id:1,title:'Tekno spark 20',price:'K2800',country:'Zambia',location:'Chipata',image:'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd',owner:'demo@z.com',description:'Good phone'},
    {id:2,title:'Chitenge Dress',price:'K500',country:'Zambia',location:'Lusaka',image:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f',owner:'demo@z.com',description:'Nice dress'},
  ]))
  const [user, setUser] = useState(()=> safeStorage.read('shopline_user', null))
  const [showSell, setShowSell] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('All')
  const [editing, setEditing] = useState(null)

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState('')
  const [country, setCountry] = useState('Zambia')
  const [town, setTown] = useState('Chipata')
  const [image, setImage] = useState('')
  const [imgPreview, setImgPreview] = useState('')
  
  const [contact, setContact] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editCountry, setEditCountry] = useState('Zambia')
  const [editTown, setEditTown] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editPic, setEditPic] = useState('')

  useEffect(()=>{ safeStorage.write('shopline_products', products) },[products])
  useEffect(()=>{ 
    if(user){ 
      safeStorage.write('shopline_user', user) 
    } else { 
      try{ localStorage.removeItem('shopline_user') }catch{} 
    } 
  },[user])

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if(!file) return
    if(file.size > 3*1024*1024){ alert('Image too big <3MB'); return }
    const reader = new FileReader()
    reader.onload = () => { setImage(reader.result); setImgPreview(reader.result) }
    reader.readAsDataURL(file)
  }

  const resetSell = () => {
    setTitle(''); setDesc(''); setPrice(''); setImage(''); setImgPreview(''); setEditing(null); setShowSell(false)
  }

  const handlePost = () => {
    if(!title || !price){ alert('Add title and price'); return }
    if(!user){ setShowAuth(true); return }
    const newPr = {
      id: editing ? editing.id : Date.now(),
      title, description: desc, price: price.startsWith('K')?price:`K${price}`,
      country, location: town, image: image || 'https://via.placeholder.com/300',
      owner: user.email
    }
    if(editing) setProducts(products.map(p=> p.id===editing.id ? newPr : p))
    else setProducts([newPr, ...products])
    resetSell()
  }

  const onEdit = (pr) => {
    setEditing(pr)
    setTitle(pr.title); setDesc(pr.description||''); setPrice(pr.price.replace('K','')); 
    setCountry(pr.country); setTown(pr.location||'Chipata'); setImage(pr.image); setImgPreview(pr.image)
    setShowSell(true)
  }
  const onDelete = (pr) => {
    if(!confirm(`Delete ${pr.title}?`)) return
    setProducts(products.filter(p=>p.id!==pr.id))
  }

  const onLogin = () => {
    if(!contact || !pass){ alert('Fill fields'); return }
    setLoading(true)
    setTimeout(()=>{
      const u = {email: contact.includes('@')?contact:`${contact}@phone.zm`, name: contact.split('@')[0], pic:'', country:'Zambia', town:'Chipata', phone:contact, bio:''}
      setUser(u); safeStorage.write('shopline_user', u)
      setShowAuth(false); setLoading(false)
    },600)
  }

  const openProfile = () => {
    if(!user){ setShowAuth(true); return }
    setEditName(user.name||''); setEditBio(user.bio||''); setEditCountry(user.country||'Zambia'); setEditTown(user.town||''); setEditPhone(user.phone||''); setEditPic(user.pic||'')
    setShowProfile(true)
  }

  const saveProfile = () => {
    setLoading(true)
    const nu = {...user, name:editName, bio:editBio, country:editCountry, town:editTown, phone:editPhone, pic:editPic}
    setTimeout(()=>{ setUser(nu); safeStorage.write('shopline_user', nu); setLoading(false); setShowProfile(false) },500)
  }

  const filtered = products.filter(p=> (p.title+p.description).toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{minHeight:'100vh',background:'#f5f7f5',fontFamily:'system-ui'}}>
      <header style={{position:'sticky',top:0,zIndex:50,background:'#fff',padding:'10px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'8px',fontWeight:'900',fontSize:'20px'}}><span style={{background:'#22c55e',color:'#fff',width:'32px',height:'32px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}>S</span>SHOPLINE</div>
        <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
          <button onClick={()=>setShowSell(true)} style={{background:'#22c55e',color:'#fff',border:'none',borderRadius:'10px',padding:'8px 16px',fontWeight:'800',cursor:'pointer'}}>+ Sell</button>
          <img onClick={openProfile} src={user?.pic || 'https://via.placeholder.com/40'} style={{width:'36px',height:'36px',borderRadius:'50%',border:'2px solid #22c55e',cursor:'pointer',objectFit:'cover'}} alt=""/>
        </div>
      </header>

      <div style={{padding:'12px'}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{width:'100%',padding:'12px 14px',borderRadius:'12px',border:'2px solid #000',marginBottom:'10px',background:'#fff',color:'#000'}}/>
        <div style={{display:'flex',gap:'8px',overflowX:'auto',paddingBottom:'6px'}}>
          {CATS.map(c=> <button key={c} onClick={()=>setCat(c)} style={{padding:'6px 14px',borderRadius:'999px',border:cat===c?'2px solid #000':'1px solid #ddd',background:cat===c?'#000':'#fff',color:cat===c?'#fff':'#000',fontWeight:'700',whiteSpace:'nowrap'}}>{c}</button>)}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',padding:'10px'}}>
        {filtered.map(pr=> <ProductCard key={pr.id} pr={pr} cats={CATS} user={user} onEdit={onEdit} onDelete={onDelete} />)}
      </div>

      {showSell && (
        <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
          <div style={{background:'#fff',width:'100%',maxWidth:'400px',borderRadius:'20px',padding:'20px',position:'relative',maxHeight:'90vh',overflowY:'auto'}}>
            <button onClick={resetSell} style={{position:'absolute',right:'14px',top:'14px',width:'32px',height:'32px',borderRadius:'50%',border:'1.5px solid #000',background:'#000',color:'#fff',fontWeight:'900',fontSize:'18px',cursor:'pointer'}}>×</button>
            <h3 style={{margin:'0 0 14px',fontSize:'19px',fontWeight:'900',color:'#000'}}>{editing? 'Edit Product' : '+ Sell Product'}</h3>
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Product name" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #e5e7eb',marginBottom:'10px',color:'#000',background:'#f9fafb'}}/>
            <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" rows={2} style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #e5e7eb',marginBottom:'10px',color:'#000',background:'#f9fafb',resize:'none'}}/>
            <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Price e.g. 2800" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #e5e7eb',marginBottom:'10px',color:'#000',background:'#f9fafb'}}/>
            <input value={country} onChange={e=>setCountry(e.target.value)} placeholder="Country" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #e5e7eb',marginBottom:'10px',color:'#000',background:'#f9fafb'}}/>
            <input value={town} onChange={e=>setTown(e.target.value)} placeholder="Town" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #e5e7eb',marginBottom:'12px',color:'#000',background:'#f9fafb'}}/>
            
            <div style={{marginBottom:'14px'}}>
              {(imgPreview||image) && <img src={imgPreview||image} style={{width:'100%',height:'150px',objectFit:'cover',borderRadius:'12px',border:'2px solid #000',marginBottom:'8px'}} alt=""/>}
              <div style={{display:'flex',gap:'8px'}}>
                <label style={{flex:1,padding:'12px',borderRadius:'12px',border:'2px dashed #000',background:'#f0fdf4',textAlign:'center',fontWeight:'800',fontSize:'13px',color:'#000',cursor:'pointer'}}>
                  📸 Upload Photo
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{display:'none'}}/>
                </label>
                <input value={image.startsWith('data:')?'Uploaded ✓':image} onChange={e=>{setImage(e.target.value); setImgPreview('')}} placeholder="Or paste link" style={{flex:1.2,padding:'12px',borderRadius:'12px',border:'2px solid #e5e7eb',color:'#000',background:'#f9fafb',fontSize:'12px'}}/>
              </div>
            </div>

            <button onClick={handlePost} style={{width:'100%',padding:'14px',borderRadius:'14px',border:'none',background:'#22c55e',color:'#fff',fontWeight:'900',fontSize:'16px',marginBottom:'12px',cursor:'pointer'}}>{editing?'Update Product':'Post Product'}</button>
            <button onClick={resetSell} style={{width:'100%',padding:'14px',borderRadius:'14px',border:'2px solid #111',background:'linear-gradient(180deg,#ffffff,#f8fafc)',color:'#111',fontWeight:'900',fontSize:'15px',boxShadow:'0 4px 0 #111, 0 6px 12px rgba(0,0,0,0.12)',cursor:'pointer'}}>✕ Cancel</button>
          </div>
        </div>
      )}

      {showAuth && <AuthModal contact={contact} setContact={setContact} pass={pass} setPass={setPass} showPass={showPass} setShowPass={setShowPass} onLogin={onLogin} onClose={()=>setShowAuth(false)} loading={loading} />}
      {showProfile && <ProfileModal user={user} editName={editName} setEditName={setEditName} editBio={editBio} setEditBio={setEditBio} editCountry={editCountry} setEditCountry={setEditCountry} editTown={editTown} setEditTown={setEditTown} editPhone={editPhone} setEditPhone={setEditPhone} editPic={editPic} setEditPic={setEditPic} onSave={saveProfile} onClose={()=>setShowProfile(false)} myAds={products.filter(p=>p.owner===user?.email).length} loading={loading} countries={COUNTRIES} />}
    </div>
  )
                                         }

import safeStorage from '../safeStorage'
export default function ProfileModal({ user, editName, setEditName, editBio, setEditBio, editCountry, setEditCountry, editTown, setEditTown, editPhone, setEditPhone, editPic, setEditPic, onSave, onClose, myAds, loading, countries }){
  const handlePic = (e) => {
    const file = e.target.files?.[0]
    if(!file) return
    const reader = new FileReader()
    reader.onload = () => setEditPic(reader.result)
    reader.readAsDataURL(file)
  }
  const handleLogout = () => {
    if(!confirm('Log out?')) return
    safeStorage.write('shopline_user', null)
    onClose()
    window.location.reload()
  }
  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
      <div style={{background:'#fff',width:'100%',maxWidth:'380px',borderRadius:'20px',padding:'20px',maxHeight:'90vh',overflowY:'auto'}}>
        <h2 style={{margin:'0 0 12px',fontSize:'22px',fontWeight:'800',color:'#000'}}>Profile</h2>
        <div style={{textAlign:'center',marginBottom:'12px'}}>
          <img src={editPic || user?.pic || 'https://via.placeholder.com/80'} style={{width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover',border:'3px solid #22c55e'}} alt=""/>
          <div style={{marginTop:'8px'}}><label style={{background:'#eef2ff',color:'#000',padding:'6px 12px',borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:'700',border:'1px solid #000'}}>Upload Pic<input type="file" accept="image/*" onChange={handlePic} style={{display:'none'}}/></label></div>
        </div>
        <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Full name" style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #000',marginBottom:'10px',color:'#000',background:'#fff'}}/>
        <textarea value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Bio" style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #000',marginBottom:'10px',color:'#000',background:'#fff',minHeight:'60px'}}/>
        <select value={editCountry} onChange={e=>setEditCountry(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #000',marginBottom:'10px',color:'#000',background:'#fff'}}>
          {(countries||['Zambia']).map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        <input value={editPhone} onChange={e=>setEditPhone(e.target.value)} placeholder="Phone" style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #000',marginBottom:'10px',color:'#000',background:'#fff'}}/>
        <input value={editTown} onChange={e=>setEditTown(e.target.value)} placeholder="Town" style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #000',marginBottom:'14px',color:'#000',background:'#fff'}}/>
        <button onClick={onSave} disabled={loading} style={{width:'100%',padding:'14px',borderRadius:'12px',border:'none',background:'#22c55e',color:'#fff',fontWeight:'800',marginBottom:'10px'}}>{loading?'Saving...':'Save'}</button>
        <button onClick={onClose} style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #000',background:'#f8fafc',color:'#000',fontWeight:'900',marginBottom:'10px',boxShadow:'0 2px 0 #000'}}>Cancel</button>
        <button onClick={handleLogout} style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #ef4444',background:'#fff',color:'#ef4444',fontWeight:'800'}}>Log Out</button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import safeStorage from '../safeStorage'

const countries = ["Zambia","Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Australia","Austria","Bangladesh","Belgium","Benin","Botswana","Brazil","Canada","China","Congo","Denmark","Egypt","Ethiopia","Finland","France","Germany","Ghana","India","Indonesia","Italy","Japan","Kenya","Malawi","Mozambique","Namibia","Nigeria","Rwanda","South Africa","Tanzania","Uganda","United Kingdom","United States","Zimbabwe"]

export default function ProfileModal({ user, editName, setEditName, editBio, setEditBio, editCountry, setEditCountry, editTown, setEditTown, editPhone, setEditPhone, editPic, setEditPic, onSave, onClose, myAds, loading }){

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
    localStorage.removeItem('shopline_user')
    onClose()
    window.location.reload()
  }

  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
      <div style={{background:'#fff',width:'100%',maxWidth:'380px',borderRadius:'20px',padding:'20px',maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'12px'}}>
          <h2 style={{margin:0,fontSize:'22px',fontWeight:'800',color:'#000'}}>Profile</h2>
          <button onClick={onClose} style={{background:'#000',color:'#fff',border:'none',borderRadius:'50%',width:'36px',height:'36px',fontSize:'20px',cursor:'pointer'}}>X</button>
        </div>

        {/* Pic Upload */}
        <div style={{textAlign:'center',marginBottom:'12px'}}>
          <img src={editPic || user?.pic || 'https://via.placeholder.com/80'} style={{width:'80px',height:'80px',borderRadius:'50%',objectFit:'cover',border:'3px solid #22c55e'}} alt="pic"/>
          <div style={{marginTop:'8px'}}>
            <label style={{background:'#eef2ff',color:'#000',padding:'6px 12px',borderRadius:'8px',cursor:'pointer',fontSize:'13px',fontWeight:'700',border:'1px solid #000'}}>📷 Upload Pic
              <input type="file" accept="image/*" onChange={handlePic} style={{display:'none'}}/>
            </label>
          </div>
        </div>

        <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Full name" style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #cbd5e1',marginBottom:'10px',color:'#000',background:'#fff',fontSize:'15px'}}/>
        
        <textarea value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Bio - tell about yourself" style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #cbd5e1',marginBottom:'10px',color:'#000',background:'#fff',fontSize:'15px',minHeight:'70px'}}/>

        <select value={editCountry} onChange={e=>setEditCountry(e.target.value)} style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #cbd5e1',marginBottom:'10px',color:'#000',background:'#fff',fontSize:'15px',fontWeight:'600'}}>
          {countries.map(c=><option key={c} value={c}>{c}</option>)}
        </select>

        <input value={editPhone} onChange={e=>setEditPhone(e.target.value)} placeholder="Phone" style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #cbd5e1',marginBottom:'10px',color:'#000',background:'#fff',fontSize:'15px'}}/>
        <input value={editTown} onChange={e=>setEditTown(e.target.value)} placeholder="Town" style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #cbd5e1',marginBottom:'14px',color:'#000',background:'#fff',fontSize:'15px'}}/>

        <button onClick={onSave} disabled={loading} style={{width:'100%',padding:'14px',borderRadius:'12px',border:'none',background:'#22c55e',color:'#fff',fontWeight:'800',fontSize:'16px',cursor:'pointer',marginBottom:'10px'}}>{loading?'Saving...':'Save Profile'}</button>

        {/* NEW Attractive Cancel */}
        <button onClick={onClose} style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #000',background:'#f8fafc',color:'#000',fontWeight:'800',fontSize:'16px',cursor:'pointer',marginBottom:'10px'}}>Cancel</button>

        <button onClick={handleLogout} style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #ef4444',background:'#fff',color:'#ef4444',fontWeight:'800',fontSize:'14px',cursor:'pointer'}}>Log Out</button>

        {myAds?.length>0 && <div style={{marginTop:'12px',fontSize:'13px',color:'#000'}}>Your ads: {myAds.length}</div>}
      </div>
    </div>
  )
                     }

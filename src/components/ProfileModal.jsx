export default function ProfileModal({ user, editName, setEditName, editBio, setEditBio, editCountry, setEditCountry, editTown, setEditTown, editPhone, setEditPhone, editPic, setEditPic, onSave, onClose, myAds, loading }){
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'16px',overflowY:'auto'}}>
      <div style={{background:'#fff',width:'100%',maxWidth:'420px',borderRadius:'16px',padding:'20px',maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:900,fontSize:'18px'}}>My Profile</div>
          <button onClick={onClose} style={{border:'none',background:'#f3f4f6',width:'32px',height:'32px',borderRadius:'50%'}}>✕</button>
        </div>
        <div style={{textAlign:'center',margin:'16px 0'}}>
          <div style={{width:'80px',height:'80px',borderRadius:'50%',background:'#111',color:'#fff',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px',fontWeight:'bold',overflow:'hidden'}}>
            {editPic ? <img src={editPic} alt="pic" style={{width:'80px',height:'80px',objectFit:'cover'}}/> : (user?.name?.[0]?.toUpperCase() || 'C')}
          </div>
          <input placeholder="Paste image URL" value={editPic} onChange={e=>setEditPic(e.target.value)} style={{width:'100%',marginTop:'10px',padding:'8px',borderRadius:'8px',border:'1px solid #ddd',fontSize:'12px'}}/>
        </div>
        <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Full Name" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}}/>
        <input value={editPhone} onChange={e=>setEditPhone(e.target.value)} placeholder="Phone" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}}/>
        <input value={editTown} onChange={e=>setEditTown(e.target.value)} placeholder="Town / City" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}}/>
        <input value={editCountry} onChange={e=>setEditCountry(e.target.value)} placeholder="Country" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}}/>
        <textarea value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Bio" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'12px',boxSizing:'border-box'}}/>
        <button onClick={onSave} disabled={loading} style={{width:'100%',background:'#16a34a',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:900}}>{loading?'Saving...':'Save Profile'}</button>
        <div style={{marginTop:'16px',fontWeight:'bold',fontSize:'14px'}}>My Ads: {myAds?.length || 0}</div>
      </div>
    </div>
  )
                                                                                                                }

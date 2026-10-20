export default function ProfileModal({ user, editName, setEditName, editBio, setEditBio, editCountry, setEditCountry, editTown, setEditTown, editPhone, setEditPhone, editPic, setEditPic, onSave, onClose, myAds, loading }){
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'16px',overflowY:'auto'}}>
      <div style={{background:'#fff',borderRadius:'20px',padding:'20px',width:'100%',maxWidth:'400px',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:'12px',right:'12px',background:'#000',color:'#fff',border:'none',borderRadius:'50%',width:'38px',height:'38px',fontWeight:'bold',fontSize:'20px'}}>✕</button>
        <h2 style={{fontSize:'20px',fontWeight:'bold',marginBottom:'12px',paddingRight:'40px'}}>Profile</h2>
        <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Name" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}} />
        <input value={editPhone} onChange={e=>setEditPhone(e.target.value)} placeholder="Phone" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}} />
        <input value={editTown} onChange={e=>setEditTown(e.target.value)} placeholder="Town" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}} />
        <button onClick={onSave} disabled={loading} style={{width:'100%',background:'#00a651',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'bold',marginTop:'8px'}}>{loading?'Saving...':'Save Profile'}</button>
        <button onClick={onClose} style={{width:'100%',marginTop:'10px',background:'#fff',color:'#000',border:'2px solid #000',padding:'12px',borderRadius:'12px',fontWeight:'bold'}}>Cancel</button>
      </div>
    </div>
  )
}

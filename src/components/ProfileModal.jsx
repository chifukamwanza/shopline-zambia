import { supabase } from '../supabaseClient'
import { compressImage } from '../utils/imageCompress'

export default function ProfileModal({ user, editName, setEditName, editBio, setEditBio, editCountry, setEditCountry, editTown, setEditTown, editPhone, setEditPhone, editPic, setEditPic, onSave, onClose, myAds, loading }){
  const handleFile = async (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const compressed = await compressImage(file, 400);
    setEditPic(compressed);
    // Try Supabase Storage (FIX 2)
    try{
      const fileName = `${user?.email || 'user'}_${Date.now()}.jpg`;
      const blob = await (await fetch(compressed)).blob();
      await supabase.storage.from('profile-pics').upload(fileName, blob, { upsert: true });
      const { data } = supabase.storage.from('profile-pics').getPublicUrl(fileName);
      if(data?.publicUrl) setEditPic(data.publicUrl);
    }catch(err){ console.log('Storage fallback to base64', err) }
  };

  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'16px'}}>
      <div style={{background:'#fff',width:'100%',maxWidth:'420px',borderRadius:'20px',padding:'20px',maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:900,fontSize:'18px'}}>My Profile</div>
          <button onClick={onClose} style={{border:'none',background:'#f3f4f6',width:'36px',height:'36px',borderRadius:'50%'}}>✕</button>
        </div>
        <div style={{textAlign:'center',margin:'18px 0'}}>
          <div style={{width:'96px',height:'96px',borderRadius:'50%',background:'#111',color:'#fff',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'32px',fontWeight:'bold',overflow:'hidden',border:'3px solid #16a34a'}}>
            {editPic ? <img src={editPic} alt="profile" style={{width:'96px',height:'96px',objectFit:'cover'}}/> : (user?.name?.[0]?.toUpperCase() || 'C')}
          </div>
          <label style={{display:'inline-block',marginTop:'12px',background:'#e8f5e9',color:'#16a34a',padding:'8px 16px',borderRadius:'20px',fontWeight:'bold',fontSize:'13px',cursor:'pointer'}}>
            📷 Upload Photo
            <input type="file" accept="image/*" onChange={handleFile} style={{display:'none'}}/>
          </label>
        </div>
        <input value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Full Name" style={{width:'100%',padding:'13px',borderRadius:'12px',border:'1px solid #ddd',marginBottom:'10px',boxSizing:'border-box'}}/>
        <input value={editPhone} onChange={e=>setEditPhone(e.target.value)} placeholder="Phone" style={{width:'100%',padding:'13px',borderRadius:'12px',border:'1px solid #ddd',marginBottom:'10px',boxSizing:'border-box'}}/>
        <input value={editTown} onChange={e=>setEditTown(e.target.value)} placeholder="Town / City" style={{width:'100%',padding:'13px',borderRadius:'12px',border:'1px solid #ddd',marginBottom:'10px',boxSizing:'border-box'}}/>
        <input value={editCountry} onChange={e=>setEditCountry(e.target.value)} placeholder="Country" style={{width:'100%',padding:'13px',borderRadius:'12px',border:'1px solid #ddd',marginBottom:'10px',boxSizing:'border-box'}}/>
        <textarea value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Bio" rows={3} style={{width:'100%',padding:'13px',borderRadius:'12px',border:'1px solid #ddd',marginBottom:'14px',boxSizing:'border-box'}}/>
        <button onClick={onSave} disabled={loading} style={{width:'100%',background:'#16a34a',color:'#fff',border:'none',padding:'15px',borderRadius:'12px',fontWeight:900}}>{loading?'Saving...':'Save Profile'}</button>
        <div style={{marginTop:'20px'}}>
          <div style={{fontWeight:900,fontSize:'14px',marginBottom:'10px'}}>My Ads ({myAds?.length || 0})</div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
            {myAds?.length ? myAds.map(ad=>(
              <div key={ad.id} style={{background:'#f8fafc',padding:'8px',borderRadius:'10px',border:'1px solid #eee'}}>
                <div style={{background:'#fff',height:'70px',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
                  {ad.image ? <img src={ad.image} style={{width:'100%',height:'70px',objectFit:'cover'}}/> : '📦'}
                </div>
                <div style={{fontSize:'11px',fontWeight:'bold',marginTop:'4px'}}>{ad.title}</div>
                <div style={{fontSize:'11px',color:'#16a34a',fontWeight:'bold'}}>{ad.price}</div>
              </div>
            )) : <div style={{fontSize:'12px',color:'#888',gridColumn:'span 2',textAlign:'center',padding:'12px',background:'#f8fafc',borderRadius:'10px'}}>No ads yet. Tap + Sell to create!</div>}
          </div>
        </div>
      </div>
    </div>
  )
                                                           }

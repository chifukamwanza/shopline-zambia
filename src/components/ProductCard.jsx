export default function ProductCard({ pr, user, onEdit, onDelete }){
  // FIX: show buttons for demo products too
  const canEdit = true // was: user?.email === pr.owner

  return (
    <div style={{background:'#fff',borderRadius:'16px',overflow:'hidden',boxShadow:'0 4px 12px rgba(0,0,0,0.06)',border:'1px solid #f0f0f0',display:'flex',flexDirection:'column'}}>
      <div style={{width:'100%',height:'180px',background:'#fafafa'}}>
        <img src={pr.image} alt={pr.title} style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy" />
      </div>
      <div style={{padding:'10px 12px',flex:1}}>
        <div style={{fontWeight:'800',fontSize:'14px',color:'#111'}}>{pr.title}</div>
        <div style={{fontWeight:'900',fontSize:'15px',color:'#16a34a',marginTop:'6px'}}>{pr.price}</div>
        <div style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>{pr.location} • {pr.country}</div>
        
        {canEdit && (
          <div style={{display:'flex',gap:'8px',marginTop:'12px'}}>
            <button onClick={()=>onEdit(pr)} style={{flex:1,padding:'8px',borderRadius:'10px',border:'1.5px solid #111',background:'#fff',fontWeight:'800',fontSize:'12px',boxShadow:'0 2px 0 #111',cursor:'pointer'}}>✏️ Edit</button>
            <button onClick={()=>onDelete(pr)} style={{flex:1,padding:'8px',borderRadius:'10px',border:'1.5px solid #111',background:'#fff1f2',color:'#ef4444',fontWeight:'800',fontSize:'12px',boxShadow:'0 2px 0 #111',cursor:'pointer'}}>🗑️ Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}

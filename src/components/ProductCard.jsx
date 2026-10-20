export default function ProductCard({ pr, cats, user, onEdit, onDelete }){
  const email = user?.email?.toLowerCase()
  const owner = pr.owner?.toLowerCase()
  const isOwner = !!user && (!owner || owner === email || pr.seller_id === user?.id || pr.seller_id?.toString() === user?.id?.toString())

  return (
    <div style={{background:'#fff',borderRadius:'12px',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',position:'relative',border: isOwner ? '2px solid #00a651' : '1px solid #eee'}}>
      <img src={pr.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={pr.title} style={{width:'100%',height:'180px',objectFit:'cover'}} />
      {isOwner && (
        <div style={{position:'absolute',top:'8px',right:'8px',display:'flex',gap:'6px',zIndex:10}}>
          <button onClick={()=>onEdit(pr)} style={{background:'#00a651',color:'#fff',border:'none',borderRadius:'20px',padding:'8px 12px',fontSize:'13px',fontWeight:'bold',boxShadow:'0 2px 8px rgba(0,0,0,0.3)'}}>✏️ Edit</button>
          <button onClick={()=>onDelete(pr)} style={{background:'#ff4444',color:'#fff',border:'none',borderRadius:'20px',padding:'8px 12px',fontSize:'13px',fontWeight:'bold'}}>🗑️</button>
        </div>
      )}
      <div style={{padding:'10px'}}>
        <div style={{fontWeight:'bold',fontSize:'14px'}}>{pr.title}</div>
        <div style={{fontSize:'12px',color:'#666'}}>- Buy in {pr.country}</div>
        <div style={{color:'#00a651',fontWeight:'bold',fontSize:'16px',marginTop:'4px'}}>K{pr.price.toString().replace('K','')}</div>
        <div style={{fontSize:'11px',color:'#888'}}>{pr.location} - {pr.country} - {pr.cat} {isOwner && '• YOURS'}</div>
      </div>
    </div>
  )
}

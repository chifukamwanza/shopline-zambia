export defauexport default function ProductCard({ pr, cats, user, onEdit, onDelete }){
  const isMine = user?.email && pr.owner && pr.owner.toLowerCase() === user.email.toLowerCase()
  const catIcon = cats.find(c=>c.id===pr.cat)?.i || '📦'
  
  return (
    <div style={{background:'#fff',borderRadius:'14px',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',position:'relative'}}>
      <div style={{position:'relative'}}>
        <img src={pr.image || 'https://via.placeholder.com/300'} alt={pr.title} style={{width:'100%',height:'180px',objectFit:'cover'}}/>
        {isMine && <div style={{position:'absolute',top:'8px',left:'8px',background:'#22c55e',color:'#fff',padding:'3px 8px',borderRadius:'6px',fontSize:'11px',fontWeight:'800'}}>YOURS</div>}
      </div>
      <div style={{padding:'10px'}}>
        <div style={{fontWeight:'800',fontSize:'15px',color:'#000',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{pr.title}</div>
        <div style={{fontSize:'12px',color:'#666'}}>- Buy in {pr.country}</div>
        <div style={{fontWeight:'900',color:'#16a34a',fontSize:'16px'}}>{pr.price}</div>
        <div style={{fontSize:'11px',color:'#888'}}>{pr.location} - {pr.country} - {pr.cat}</div>
        {isMine && (
          <div style={{display:'flex',gap:'6px',marginTop:'8px'}}>
            <button onClick={()=>onEdit(pr)} style={{flex:1,background:'#e0f2fe',border:'1px solid #000',borderRadius:'8px',padding:'6px',fontWeight:'800',fontSize:'12px',cursor:'pointer',color:'#000'}}>✏️ Edit</button>
            <button onClick={()=>onDelete(pr)} style={{flex:1,background:'#fee2e2',border:'1px solid #000',borderRadius:'8px',padding:'6px',fontWeight:'800',fontSize:'12px',cursor:'pointer',color:'#000'}}>🗑️ Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}

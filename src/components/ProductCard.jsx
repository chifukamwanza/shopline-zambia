export default function ProductCard({ pr, user, onEdit, onDelete }){
  const isMine = user?.email && pr.owner && pr.owner.toLowerCase() === user.email.toLowerCase()
  return (
    <div style={{background:'#fff',borderRadius:'16px',overflow:'hidden',boxShadow:'0 4px 12px rgba(0,0,0,0.08)',border:'1px solid #f0f0f0',display:'flex',flexDirection:'column'}}>
      <div style={{position:'relative'}}>
        <img src={pr.image || 'https://via.placeholder.com/300'} alt="" style={{width:'100%',height:'190px',objectFit:'cover'}}/>
        {isMine && <div style={{position:'absolute',top:'10px',left:'10px',background:'#22c55e',color:'#fff',padding:'4px 10px',borderRadius:'999px',fontSize:'11px',fontWeight:'800',boxShadow:'0 2px 6px rgba(0,0,0,0.15)'}}>YOURS</div>}
      </div>
      <div style={{padding:'12px'}}>
        <div style={{fontWeight:'800',color:'#111',fontSize:'15px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{pr.title}</div>
        <div style={{color:'#16a34a',fontWeight:'900',fontSize:'15px',marginTop:'2px'}}>{pr.price}</div>
        <div style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>{pr.location} • {pr.country}</div>
        {isMine && (
          <div style={{display:'flex',gap:'8px',marginTop:'12px'}}>
            <button onClick={()=>onEdit(pr)} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',background:'linear-gradient(135deg,#dbeafe,#bfdbfe)',border:'1.5px solid #000',borderRadius:'10px',padding:'8px 0',fontWeight:'800',fontSize:'13px',cursor:'pointer',color:'#1e40af'}}>✏️ Edit</button>
            <button onClick={()=>onDelete(pr)} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',background:'linear-gradient(135deg,#fee2e2,#fecaca)',border:'1.5px solid #000',borderRadius:'10px',padding:'8px 0',fontWeight:'800',fontSize:'13px',cursor:'pointer',color:'#991b1b'}}>🗑️ Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}

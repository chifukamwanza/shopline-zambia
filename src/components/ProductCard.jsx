export default function ProductCard({ pr, cats, user, onEdit, onDelete }){
  return (
    <div style={{background:'#fff',borderRadius:'16px',overflow:'hidden',boxShadow:'0 4px 12px rgba(0,0,0,0.07)',border:'1px solid #f0f0f0',display:'flex',flexDirection:'column'}}>
      <div style={{width:'100%',height:'180px',background:'#f8f8f8',overflow:'hidden'}}>
        <img src={pr.image} alt={pr.title} style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy" />
      </div>
      <div style={{padding:'10px 12px',flex:1,display:'flex',flexDirection:'column'}}>
        <div style={{fontWeight:'800',fontSize:'14px',color:'#111',lineHeight:'1.2',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',minHeight:'34px'}}>{pr.title}</div>
        <div style={{fontWeight:'900',fontSize:'15px',color:'#16a34a',marginTop:'6px'}}>{pr.price}</div>
        <div style={{fontSize:'11px',color:'#888',marginTop:'2px'}}>{pr.location} • {pr.country}</div>
        {user?.email === pr.owner && (
          <div style={{display:'flex',gap:'6px',marginTop:'10px'}}>
            <button onClick={()=>onEdit(pr)} style={{flex:1,padding:'7px',borderRadius:'10px',border:'1.5px solid #111',background:'#fff',fontWeight:'800',fontSize:'12px',cursor:'pointer'}}>Edit</button>
            <button onClick={()=>onDelete(pr)} style={{flex:1,padding:'7px',borderRadius:'10px',border:'1.5px solid #ef4444',background:'#fef2f2',color:'#ef4444',fontWeight:'800',fontSize:'12px',cursor:'pointer'}}>Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}

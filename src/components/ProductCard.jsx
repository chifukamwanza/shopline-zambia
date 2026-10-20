export default function ProductCard({ pr, user, onEdit, onDelete }){
  return (
    <div style={{background:'#fff',borderRadius:'16px',overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,0.06)',border:'1px solid #f0f0f0',display:'flex',flexDirection:'column'}}>
      <div style={{width:'100%',height:'200px',background:'#f8fafb'}}>
        <img src={pr.image} alt={pr.title} style={{width:'100%',height:'100%',objectFit:'cover'}} />
      </div>
      <div style={{padding:'12px'}}>
        <div style={{fontWeight:'700',fontSize:'15px',color:'#111',lineHeight:'1.3',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{pr.title}</div>
        <div style={{fontWeight:'800',fontSize:'16px',color:'#16a34a',marginTop:'4px'}}>{pr.price}</div>
        <div style={{fontSize:'12px',color:'#6b7280',marginTop:'2px'}}>{pr.location} • {pr.country}</div>
        
        <div style={{display:'flex',gap:'8px',marginTop:'12px'}}>
          <button onClick={()=>onEdit(pr)} style={{flex:1,height:'36px',borderRadius:'10px',border:'1px solid #111827',background:'#fff',color:'#111827',fontWeight:'600',fontSize:'13px',cursor:'pointer'}}>Edit</button>
          <button onClick={()=>onDelete(pr)} style={{flex:1,height:'36px',borderRadius:'10px',border:'1px solid #fecaca',background:'#fff',color:'#ef4444',fontWeight:'600',fontSize:'13px',cursor:'pointer'}}>Delete</button>
        </div>
      </div>
    </div>
  )
}

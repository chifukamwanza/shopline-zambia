export default function ProductCard({ pr, user, onEdit, onDelete }){
  const isMine = user && pr.owner === user.email
  const phone = pr.phone || "260770000000"
  
  return (
    <div style={{background:'#fff',borderRadius:'16px',overflow:'hidden',boxShadow:'0 1px 4px rgba(0,0,0,0.08)',border:'1px solid #eee',display:'flex',flexDirection:'column'}}>
      <div style={{width:'100%',height:'190px',background:'#f5f5f5'}}>
        <img src={pr.image} alt={pr.title} style={{width:'100%',height:'100%',objectFit:'cover'}} />
      </div>
      <div style={{padding:'10px'}}>
        <div style={{fontWeight:'700',fontSize:'14px',color:'#111',lineHeight:'1.2',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{pr.title}</div>
        <div style={{fontWeight:'800',fontSize:'18px',color:'#16a34a',marginTop:'2px'}}>K{pr.price.toString().replace('K','').replace('k','')}</div>
        <div style={{marginTop:'6px'}}><span style={{fontSize:'11px',background:'#eef6ff',color:'#4b5563',padding:'3px 10px',borderRadius:'20px',border:'1px solid #e5edff'}}>Cash</span></div>
        
        {isMine ? (
          <div style={{display:'flex',gap:'6px',marginTop:'10px'}}>
            <button onClick={()=>onEdit(pr)} style={{flex:1,height:'34px',borderRadius:'10px',border:'1px solid #111827',background:'#fff',color:'#111827',fontWeight:'700',fontSize:'12px'}}>Edit</button>
            <button onClick={()=>onDelete(pr)} style={{flex:1,height:'34px',borderRadius:'10px',border:'1px solid #fecaca',background:'#fff',color:'#ef4444',fontWeight:'700',fontSize:'12px'}}>Delete</button>
          </div>
        ) : (
          <a href={`https://wa.me/${phone.replace(/\D/g,'')}?text=Hi, I'm interested in ${pr.title}`} target="_blank" style={{display:'block',marginTop:'10px',textAlign:'center',background:'#22c55e',color:'#fff',padding:'9px',borderRadius:'10px',fontWeight:'800',fontSize:'13px',textDecoration:'none'}}>WhatsApp</a>
        )}
      </div>
    </div>
  )
}

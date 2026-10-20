export default function ProductCard({ pr, user, onEdit, onDelete }){
  const phone = pr.phone || "260978000000"
  const isMine = user && pr.owner && user.email && pr.owner.toLowerCase() === user.email.toLowerCase()
  return (
    <div style={{background:'#fff',borderRadius:'14px',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',display:'flex',flexDirection:'column',width:'100%'}}>
      <div style={{width:'100%',height:'180px',background:'#f5f5f5'}}>
        <img src={pr.image} alt={pr.title} style={{width:'100%',height:'100%',objectFit:'cover'}} />
      </div>
      <div style={{padding:'10px',boxSizing:'border-box'}}>
        <div style={{fontWeight:'700',fontSize:'14px',color:'#000',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{pr.title}</div>
        <div style={{fontWeight:'900',fontSize:'18px',color:'#16a34a',marginTop:'2px'}}>K{pr.price.toString().replace(/K|k|,/g,'')}</div>
        <div style={{marginTop:'6px'}}><span style={{fontSize:'11px',background:'#f1f5f9',color:'#475569',padding:'4px 12px',borderRadius:'20px',border:'1px solid #e2e8f0'}}>Cash</span></div>
        
        <a href={`https://wa.me/${phone.toString().replace(/\D/g,'')}?text=Hi, I'm interested in ${pr.title}`} target="_blank" style={{display:'block',marginTop:'10px',textAlign:'center',background:'#22c55e',color:'#fff',padding:'10px',borderRadius:'12px',fontWeight:'800',fontSize:'13px',textDecoration:'none',boxSizing:'border-box'}}>WhatsApp</a>

        {isMine && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',marginTop:'8px',width:'100%'}}>
            <button onClick={()=>onEdit(pr)} style={{width:'100%',height:'36px',borderRadius:'10px',border:'1.5px solid #111827',background:'#fff',color:'#111827',fontWeight:'800',fontSize:'13px',boxSizing:'border-box'}}>Edit</button>
            <button onClick={()=>onDelete(pr)} style={{width:'100%',height:'36px',borderRadius:'10px',border:'1.5px solid #fecaca',background:'#fff7f7',color:'#dc2626',fontWeight:'800',fontSize:'13px',boxSizing:'border-box'}}>Delete</button>
          </div>
        )}
      </div>
    </div>
  )
            }

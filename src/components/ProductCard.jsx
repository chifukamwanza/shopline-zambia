export default function ProductCard({ pr, user, onEdit, onDelete }){
  return (
    <div style={{background:'#fff',borderRadius:'16px',overflow:'hidden',boxShadow:'0 2px 10px rgba(0,0,0,0.06)',border:'1px solid #f0f0f0',display:'flex',flexDirection:'column'}}>
      <div style={{width:'100%',height:'200px',background:'#f8f8f8'}}>
        <img src={pr.image} alt={pr.title} style={{width:'100%',height:'100%',objectFit:'cover'}} loading="lazy" />
      </div>
      <div style={{padding:'12px',flex:1,display:'flex',flexDirection:'column'}}>
        <div style={{fontWeight:'700',fontSize:'14.5px',color:'#111',lineHeight:'1.3',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden',minHeight:'38px'}}>{pr.title}</div>
        <div style={{fontWeight:'800',fontSize:'16px',color:'#16a34a',marginTop:'6px'}}>K{pr.price.toString().replace('K','')}</div>
        <div style={{fontSize:'12px',color:'#6b7280',marginTop:'2px'}}>{pr.location} • {pr.country}</div>
        
        <div style={{display:'flex',gap:'8px',marginTop:'14px'}}>
          <button 
            onClick={()=>onEdit(pr)} 
            style={{
              flex:1,
              padding:'9px 0',
              borderRadius:'10px',
              border:'1px solid #e5e7eb',
              background:'#ffffff',
              color:'#111827',
              fontWeight:'600',
              fontSize:'13.5px',
              cursor:'pointer',
              letterSpacing:'0.2px'
            }}
          >
            Edit
          </button>
          <button 
            onClick={()=>onDelete(pr)} 
            style={{
              flex:1,
              padding:'9px 0',
              borderRadius:'10px',
              border:'1px solid #fee2e2',
              background:'#fef2f2',
              color:'#dc2626',
              fontWeight:'600',
              fontSize:'13.5px',
              cursor:'pointer',
              letterSpacing:'0.2px'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

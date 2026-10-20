export default function ProductCard({ pr, cats, isOwner, onEdit, onDelete }){
  return (
    <div style={{background:'#fff',borderRadius:'12px',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',position:'relative'}}>
      <img src={pr.image} alt={pr.title} style={{width:'100%',height:'180px',objectFit:'cover'}} />
      
      {/* EDIT BUTTON - ONLY SHOWS ON YOUR PRODUCTS */}
      {isOwner && (
        <div style={{position:'absolute',top:'8px',right:'8px',display:'flex',gap:'6px'}}>
          <button onClick={()=>onEdit(pr)} style={{background:'#fff',border:'none',borderRadius:'20px',padding:'6px 10px',fontSize:'12px',fontWeight:'bold',boxShadow:'0 2px 5px rgba(0,0,0,0.2)'}}>✏️ Edit</button>
          <button onClick={()=>onDelete(pr)} style={{background:'#ff4444',color:'#fff',border:'none',borderRadius:'20px',padding:'6px 10px',fontSize:'12px',fontWeight:'bold'}}>🗑️</button>
        </div>
      )}

      <div style={{padding:'10px'}}>
        <div style={{fontWeight:'bold',fontSize:'14px',lineHeight:'1.2'}}>{pr.title}</div>
        <div style={{fontSize:'12px',color:'#666'}}>- Buy in {pr.country}</div>
        <div style={{color:'#00a651',fontWeight:'bold',fontSize:'16px',marginTop:'4px'}}>{pr.price}</div>
        <div style={{fontSize:'11px',color:'#888'}}>{pr.location} - {pr.country} - {pr.cat}</div>
      </div>
    </div>
  )
        }

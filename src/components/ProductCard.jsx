export default function ProductCard({ pr, user, onEdit, onDelete }){
  const isMine = user?.email && pr.owner && pr.owner.toLowerCase() === user.email.toLowerCase()
  return (
    <div style={{background:'#fff',borderRadius:'14px',overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,0.08)'}}>
      <img src={pr.image || 'https://via.placeholder.com/300'} alt="" style={{width:'100%',height:'180px',objectFit:'cover'}}/>
      <div style={{padding:'10px'}}>
        <div style={{fontWeight:'800',color:'#000'}}>{pr.title}</div>
        <div style={{color:'#16a34a',fontWeight:'900'}}>{pr.price}</div>
        {isMine && (
          <div style={{display:'flex',gap:'6px',marginTop:'8px'}}>
            <button onClick={()=>onEdit(pr)} style={{flex:1,border:'1px solid #000',borderRadius:'8px',padding:'6px',background:'#e0f2fe'}}>Edit</button>
            <button onClick={()=>onDelete(pr)} style={{flex:1,border:'1px solid #000',borderRadius:'8px',padding:'6px',background:'#fee2e2'}}>Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}

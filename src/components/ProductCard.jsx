export default function ProductCard({ pr, cats }){
  return (
    <div style={{background:'#fff',padding:'8px',borderRadius:'12px',border:'1px solid #eee'}}>
      <div style={{background:'#f1f5f9',height:'110px',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'28px'}}>
        {pr.image ? <img src={pr.image} style={{width:'100%',height:'110px',objectFit:'cover',borderRadius:'8px'}}/> : cats.find(x=>x.id===pr.cat)?.i||'📦'}
      </div>
      <div style={{fontWeight:'bold',fontSize:'13px',marginTop:'6px'}}>{pr.title} for Sale in {pr.location}</div>
      <div style={{fontSize:'11px',color:'#666'}}>{pr.desc||''} - Buy in {pr.country}</div>
      <div style={{color:'#16a34a',fontWeight:900,marginTop:'2px'}}>{pr.price}</div>
      <div style={{fontSize:'11px',color:'#666'}}>{pr.location} - {pr.country} - {pr.cat}</div>
    </div>
  )
}

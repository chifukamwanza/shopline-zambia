export default function Logo({ size=34 }){
  return (
    <div style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}}>
      <div style={{
        width:size, 
        height:size, 
        background:'linear-gradient(135deg,#14532d,#16a34a,#4ade80)', 
        borderRadius:'10px',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        fontWeight:900,
        color:'#fff',
        fontSize:size*0.55,
        position:'relative'
      }}>
        <span style={{marginTop:'-2px'}}>S</span>
        <div style={{position:'absolute',top:'4px',width:'55%',height:'35%',border:'2.5px solid #fff',borderBottom:'none',borderRadius:'10px 10px 0 0',opacity:0.9}}></div>
      </div>
      <span style={{fontWeight:900,color:'#111',fontSize:size*0.52,letterSpacing:'-0.5px'}}>SHOPLINE</span>
    </div>
  )
}

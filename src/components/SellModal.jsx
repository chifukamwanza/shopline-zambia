export default function SellModal({ t,setT,d,setD,p,setP,loc,setLoc,nc,setNc,nCountry,setNCountry,img,setImg,cats,countries,onSell,onClose,editingProduct }){
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'16px',overflowY:'auto'}}>
      <div style={{background:'#fff',borderRadius:'20px',padding:'20px',width:'100%',maxWidth:'400px',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:'12px',right:'12px',background:'#000',color:'#fff',border:'none',borderRadius:'50%',width:'38px',height:'38px',fontWeight:'bold',fontSize:'20px',cursor:'pointer'}}>✕</button>
        <h2 style={{fontSize:'20px',fontWeight:'bold',marginBottom:'12px',paddingRight:'40px'}}>{editingProduct ? '✏️ Edit Product' : '+ Sell Product'}</h2>
        <input value={t} onChange={e=>setT(e.target.value)} placeholder="Title e.g. Chitenge dress" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}} />
        <textarea value={d} onChange={e=>setD(e.target.value)} placeholder="Description" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',minHeight:'60px',boxSizing:'border-box'}} />
        <input value={p} onChange={e=>setP(e.target.value)} placeholder="Price e.g. 450" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}} />
        <input value={loc} onChange={e=>setLoc(e.target.value)} placeholder="Location e.g. Chipata" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}} />
        <input value={img} onChange={e=>setImg(e.target.value)} placeholder="Image URL" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'12px',boxSizing:'border-box'}} />
        <button onClick={onSell} style={{width:'100%',background:'#00a651',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'bold',fontSize:'16px',cursor:'pointer'}}>{editingProduct ? 'Save Changes' : 'Post Product'}</button>
        <button onClick={onClose} style={{width:'100%',marginTop:'10px',background:'#fff',color:'#000',border:'2px solid #000',padding:'12px',borderRadius:'12px',fontWeight:'bold',cursor:'pointer'}}>Cancel</button>
      </div>
    </div>
  )
}

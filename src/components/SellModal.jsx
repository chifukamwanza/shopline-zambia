export default function SellModal({ t, setT, d, setD, p, setP, loc, setLoc, nc, setNc, nCountry, setNCountry, img, setImg, cats, countries, onSell, onClose }){
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'16px',overflowY:'auto'}}>
      <div style={{background:'#fff',width:'100%',maxWidth:'420px',borderRadius:'16px',padding:'20px',maxHeight:'90vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <div style={{fontWeight:900,fontSize:'18px'}}>Sell Product</div>
          <button onClick={onClose} style={{border:'none',background:'#f3f4f6',width:'32px',height:'32px',borderRadius:'50%'}}>✕</button>
        </div>
        <input value={t} onChange={e=>setT(e.target.value)} placeholder="Title (e.g. iPhone 13)" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginTop:'12px',marginBottom:'8px',boxSizing:'border-box'}}/>
        <textarea value={d} onChange={e=>setD(e.target.value)} placeholder="Description" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}}/>
        <input value={p} onChange={e=>setP(e.target.value)} placeholder="Price (e.g. 8500)" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}}/>
        <div style={{display:'flex',gap:'8px',marginBottom:'8px'}}>
          <select value={nc} onChange={e=>setNc(e.target.value)} style={{flex:1,padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}>{cats.map(c=><option key={c.id} value={c.id}>{c.l}</option>)}</select>
          <select value={nCountry} onChange={e=>setNCountry(e.target.value)} style={{flex:1,padding:'12px',borderRadius:'10px',border:'1px solid #ddd'}}>{countries.map(c=><option key={c} value={c}>{c}</option>)}</select>
        </div>
        <input value={loc} onChange={e=>setLoc(e.target.value)} placeholder="Town" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'8px',boxSizing:'border-box'}}/>
        <input value={img} onChange={e=>setImg(e.target.value)} placeholder="Image URL (optional)" style={{width:'100%',padding:'12px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'12px',boxSizing:'border-box'}}/>
        <button onClick={onSell} style={{width:'100%',background:'#16a34a',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:900}}>Post Ad</button>
      </div>
    </div>
  )
} 

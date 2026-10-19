import { supabase } from '../supabaseClient'
import { compressImage } from '../utils/imageCompress'
import { useState } from 'react'

export default function SellModal({ t, setT, d, setD, p, setP, loc, setLoc, nc, setNc, nCountry, setNCountry, img, setImg, cats, countries, onSell, onClose }){
  const [uploading, setUploading] = useState(false)
  const handleFile = async (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    setUploading(true);
    const compressed = await compressImage(file, 500);
    setImg(compressed);
    try{
      const fileName = `product_${Date.now()}_${file.name}`;
      const blob = await (await fetch(compressed)).blob();
      await supabase.storage.from('product-images').upload(fileName, blob);
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      if(data?.publicUrl) setImg(data.publicUrl);
    }catch(err){ console.log('Use compressed base64', err) }
    setUploading(false);
  };

  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'16px'}}>
      <div style={{background:'#fff',width:'100%',maxWidth:'440px',borderRadius:'20px',padding:'20px',maxHeight:'92vh',overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:900,fontSize:'18px'}}>Post New Ad</div>
          <button onClick={onClose} style={{border:'none',background:'#f3f4f6',width:'36px',height:'36px',borderRadius:'50%'}}>✕</button>
        </div>
        <label style={{display:'block',marginTop:'14px',border:'2px dashed #16a34a',borderRadius:'14px',padding:'14px',textAlign:'center',cursor:'pointer',background: img ? '#f0fdf4' : '#fafafa'}}>
          {img ? <img src={img} style={{width:'100%',maxHeight:'180px',objectFit:'cover',borderRadius:'10px'}}/> : <div style={{color:'#16a34a',fontWeight:'bold',fontSize:'14px'}}>{uploading ? 'Compressing...' : '📷 Tap to Upload Product Photo'}</div>}
          <input type="file" accept="image/*" onChange={handleFile} style={{display:'none'}}/>
        </label>
        <input value={t} onChange={e=>setT(e.target.value)} placeholder="Title (e.g. iPhone 13 Pro)" style={{width:'100%',padding:'13px',borderRadius:'12px',border:'1px solid #ddd',marginTop:'14px',marginBottom:'10px',boxSizing:'border-box'}}/>
        <textarea value={d} onChange={e=>setD(e.target.value)} placeholder="Description" rows={3} style={{width:'100%',padding:'13px',borderRadius:'12px',border:'1px solid #ddd',marginBottom:'10px',boxSizing:'border-box'}}/>
        <input value={p} onChange={e=>setP(e.target.value)} placeholder="Price (e.g. 8500)" type="number" style={{width:'100%',padding:'13px',borderRadius:'12px',border:'1px solid #ddd',marginBottom:'10px',boxSizing:'border-box'}}/>
        <div style={{display:'flex',gap:'8px',marginBottom:'10px'}}>
          <select value={nc} onChange={e=>setNc(e.target.value)} style={{flex:1,padding:'13px',borderRadius:'12px',border:'1px solid #ddd'}}>{cats.map(c=><option key={c.id} value={c.id}>{c.l}</option>)}</select>
          <select value={nCountry} onChange={e=>setNCountry(e.target.value)} style={{flex:1,padding:'13px',borderRadius:'12px',border:'1px solid #ddd'}}>{countries.map(c=><option key={c} value={c}>{c}</option>)}</select>
        </div>
        <input value={loc} onChange={e=>setLoc(e.target.value)} placeholder="Town / Location" style={{width:'100%',padding:'13px',borderRadius:'12px',border:'1px solid #ddd',marginBottom:'16px',boxSizing:'border-box'}}/>
        <button onClick={onSell} style={{width:'100%',background:'#16a34a',color:'#fff',border:'none',padding:'16px',borderRadius:'14px',fontWeight:900,fontSize:'16px'}}>Post Ad Now</button>
      </div>
    </div>
  )
                                                                     }

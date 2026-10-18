import React from 'react'

export default function SellModal({ show, img, handleImg, t, setT, d, setD, nc, setNc, p, setP, loc, setLoc, nCountry, setNCountry, countries, cats, onSell, onClose }){
  if(!show) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 35 }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '420px', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ margin: 0 }}>Sell Item</h3>
        <input type='file' accept='image/*' onChange={handleImg} />
        {img && <img src={img} style={{ height: '90px', width: '100%', objectFit: 'cover', borderRadius: '12px' }} />}
        <input value={t} onChange={(e)=>setT(e.target.value)} placeholder='Title' style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
        <textarea value={d} onChange={(e)=>setD(e.target.value)} placeholder='Description' rows={3} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
        <select value={nc} onChange={(e)=>setNc(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }}>
          {cats.filter((c)=>c.id!=='All'&&c.id!=='Trending').map((c)=><option key={c.id} value={c.id}>{c.l}</option>)}
        </select>
        <input value={p} onChange={(e)=>setP(e.target.value)} placeholder='Price' style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <input value={loc} onChange={(e)=>setLoc(e.target.value)} placeholder='Town' style={{ flex:1, padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
          <select value={nCountry} onChange={(e)=>setNCountry(e.target.value)} style={{ flex:1, padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }}>
            {countries.map((c)=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={onSell} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold' }}>Post Free</button>
        <button onClick={onClose} style={{ background: '#111', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold' }}>Cancel</button>
      </div>
    </div>
  )
}

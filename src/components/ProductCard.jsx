import React from 'react'

export default function ProductCard({ pr, cats }){
  const icon = cats.find((x)=>x.id===pr.cat)?.i || '🛍️'
  return (
    <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', border: '1px solid #eee' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '110px', background: '#f1f5f9', borderRadius: '8px' }}>
        {pr.image ? <img src={pr.image} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : <span style={{ fontSize: '28px' }}>{icon}</span>}
      </div>
      <div style={{ fontWeight: 'bold', fontSize: '13px', marginTop: '8px' }}>{pr.title}</div>
      <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{pr.desc || ''}</div>
      <div style={{ color: '#16a34a', fontWeight: 'bold', marginTop: '8px' }}>{pr.price}</div>
      <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>{pr.location} - {pr.country}</div>
    </div>
  )
}

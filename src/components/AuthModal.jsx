import React from 'react'

export default function AuthModal({ show, contact, setContact, pass, setPass, showPass, setShowPass, onLogin, onClose, loading }){
  if(!show) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 40 }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '360px', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h2 style={{ margin: 0 }}>Shopline Market</h2>
        <input value={contact} onChange={(e)=>setContact(e.target.value)} placeholder='Email or phone' style={{ padding: '14px', borderRadius: '12px', border: '1px solid #ccc' }} />
        <div style={{ position: 'relative' }}>
          <input value={pass} onChange={(e)=>setPass(e.target.value)} type={showPass ? 'text' : 'password'} placeholder='Password' style={{ width: '100%', padding: '14px 42px 14px 14px', borderRadius: '12px', border: '1px solid #ccc' }} />
          <span onClick={()=>setShowPass(s=>!s)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}>{showPass ? '🙈' : '👁️'}</span>
        </div>
        <button onClick={onLogin} disabled={loading} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>{loading ? 'Waiting...' : 'Log In / Sign Up'}</button>
        <button onClick={onClose} style={{ background: '#111', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>Cancel</button>
      </div>
    </div>
  )
}

import React from 'react'

export default function VerifyModal({ show, pendingUser, generatedCode, verifyInput, setVerifyInput, onConfirm, onBack, loading }){
  if(!show) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '360px', borderRadius: '18px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontSize: '42px', textAlign: 'center' }}>🔐</div>
        <h2 style={{ margin: 0, textAlign: 'center' }}>Verify Account</h2>
        <p style={{ textAlign: 'center', fontSize: '13px', margin: 0 }}>Code sent to <b>{pendingUser?.email || pendingUser?.phone}</b></p>
        <div style={{ background: '#dcfce7', padding: '8px 12px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' }}>CODE: {generatedCode}</div>
        <input value={verifyInput} onChange={(e)=>setVerifyInput(e.target.value)} placeholder='Enter 6-digit code' maxLength={6} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #ccc', textAlign: 'center', fontSize: '22px', letterSpacing: '6px' }} />
        <button onClick={onConfirm} disabled={loading} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>{loading ? 'Verifying...' : 'Verify & Create'}</button>
        <button onClick={onBack} style={{ background: '#111', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold' }}>Back</button>
      </div>
    </div>
  )
}

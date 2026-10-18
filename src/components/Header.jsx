import React from 'react'

export default function Header({ user, onSellClick, onProfileClick, onLoginClick, picToShow, initial }){
  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', alignItems: 'center' }}>
        <div style={{ color: '#16a34a', fontWeight: 900, lineHeight: '14px', fontSize: '15px' }}>SHOPLINE</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {user ? (
            <>
              <button onClick={onSellClick} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '10px', fontWeight: 'bold' }}>+ Sell</button>
              <div onClick={onProfileClick} style={{ width: '42px', height: '42px', borderRadius: '50%', background: picToShow ? '#fff' : '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', border: '2px solid #16a34a', overflow: 'hidden' }}>
                {picToShow ? <img src={picToShow} style={{ width: '42px', height: '42px', objectFit: 'cover' }} /> : initial}
              </div>
            </>
          ) : (
            <button onClick={onLoginClick} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold' }}>Log In</button>
          )}
        </div>
      </div>
    </header>
  )
}

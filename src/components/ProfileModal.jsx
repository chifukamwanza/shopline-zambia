import React from 'react'

export default function ProfileModal({ show, userEmail, picToShow, initial, editName, setEditName, editBio, setEditBio, editCountry, setEditCountry, editTown, setEditTown, editPhone, setEditPhone, handleProfilePic, onSave, onLogout, onClose, loading, countries }){
  if(!show) return null
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '420px', borderRadius: '22px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px' }}>My Profile</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '26px', fontWeight: 'bold', overflow: 'hidden' }}>
            {picToShow ? <img src={picToShow} style={{ width: '90px', height: '90px', objectFit: 'cover' }} /> : initial}
          </div>
        </div>
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Profile Pic</label>
        <input type='file' accept='image/*' onChange={handleProfilePic} style={{ fontSize: '12px' }} />
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Display Name</label>
        <input value={editName} onChange={(e)=>setEditName(e.target.value)} placeholder='e.g. Chifuka Mwanza' style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Bio</label>
        <textarea value={editBio} onChange={(e)=>setEditBio(e.target.value)} placeholder='Tell buyers about yourself...' rows={3} style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Country</label>
            <select value={editCountry} onChange={(e)=>setEditCountry(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }}>
              {countries.map((c)=> <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Town</label>
            <input value={editTown} onChange={(e)=>setEditTown(e.target.value)} placeholder='Lusaka' style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
          </div>
        </div>
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Phone</label>
        <input value={editPhone} onChange={(e)=>setEditPhone(e.target.value)} placeholder='0970...' style={{ padding: '12px', borderRadius: '10px', border: '1px solid #ccc' }} />
        <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Email</label>
        <input value={userEmail} disabled style={{ padding: '12px', borderRadius: '10px', border: '1px solid #eee', background: '#f3f4f6' }} />
        <button onClick={onSave} disabled={loading} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold' }}>{loading ? 'Saving...' : 'Save Profile'}</button>
        <button onClick={onLogout} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold' }}>Logout</button>
        <button onClick={onClose} style={{ background: '#111', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold' }}>Close</button>
      </div>
    </div>
  )
}

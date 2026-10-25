export default function ProfileModal({ user, editName, setEditName, editBio, setEditBio, editCountry, setEditCountry, editTown, setEditTown, editPhone, setEditPhone, editPic, setEditPic, countries, onSave, onClose, onLogout, onVerify, loading }) {
  const handlePic = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setEditPic(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '420px', borderRadius: '20px', padding: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ margin: '0 0 12px', fontSize: '22px', fontWeight: '800', color: '#000' }}>Profile</h2>

        <div style={{ textAlign: 'center', marginBottom: '12px' }}>
          <img src={editPic || user?.pic || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'} alt="profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: user?.verified ? '3px solid #22c55e' : '3px solid #f59e0b' }} />
          <div style={{ marginTop: '8px' }}>
            <label style={{ background: '#eef2ff', color: '#000', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', border: '1px solid #c7d2fe' }}>
              Change photo
              <input type="file" accept="image/*" onChange={handlePic} style={{ display: 'none' }} />
            </label>
          </div>
        </div>

        <div style={{ background: user?.verified ? '#ecfdf5' : '#fff7ed', color: '#111827', border: `1px solid ${user?.verified ? '#a7f3d0' : '#fdba74'}`, borderRadius: '10px', padding: '10px 12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569' }}>Verification</div>
          <div style={{ fontWeight: '800', marginTop: '2px' }}>
            {user?.verified ? (user.verificationMethod === 'whatsapp' ? 'Verified via WhatsApp' : 'Verified via Email') : 'Pending verification'}
          </div>
        </div>

        <input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Full name" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #000', marginBottom: '10px', boxSizing: 'border-box' }} />
        <textarea value={editBio} onChange={e => setEditBio(e.target.value)} placeholder="Bio" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #000', marginBottom: '10px', minHeight: '80px', resize: 'vertical', boxSizing: 'border-box' }} />
        <select value={editCountry} onChange={e => setEditCountry(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #000', marginBottom: '10px', color: '#000', background: '#fff', boxSizing: 'border-box' }}>
          {(countries || ['Zambia']).map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
        <input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="WhatsApp number" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #000', marginBottom: '10px', boxSizing: 'border-box' }} />
        <input value={editTown} onChange={e => setEditTown(e.target.value)} placeholder="Town" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #000', marginBottom: '14px', boxSizing: 'border-box' }} />

        {!user?.verified && (
          <button onClick={onVerify} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#f59e0b', color: '#fff', fontWeight: '800', marginBottom: '10px', cursor: 'pointer' }}>
            Verify account
          </button>
        )}

        <button onClick={onSave} disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#22c55e', color: '#fff', fontWeight: '800', marginBottom: '10px', cursor: 'pointer' }}>
          {loading ? 'Saving...' : 'Save profile'}
        </button>

        <button onClick={onClose} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #000', background: '#f8fafc', color: '#000', fontWeight: '900', marginBottom: '10px', boxShadow: '0 2px 0 #000', cursor: 'pointer' }}>
          Close
        </button>

        <button onClick={onLogout} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #ef4444', background: '#fff', color: '#ef4444', fontWeight: '800', cursor: 'pointer' }}>
          Log out
        </button>
      </div>
    </div>
  )
}

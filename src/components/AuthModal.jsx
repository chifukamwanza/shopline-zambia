export default function AuthModal({ contact, setContact, pass, setPass, showPass, setShowPass, onLogin, onClose, loading, authMode, setAuthMode }){
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '380px', borderRadius: '20px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', background: '#f3f4f6', borderRadius: '12px', padding: '4px' }}>
          <button onClick={() => setAuthMode('login')} style={{ flex: 1, background: authMode === 'login' ? '#16a34a' : 'transparent', color: authMode === 'login' ? '#fff' : '#111827', border: 'none', borderRadius: '10px', padding: '10px 12px', fontWeight: '800', cursor: 'pointer' }}>
            Log in
          </button>
          <button onClick={() => setAuthMode('signup')} style={{ flex: 1, background: authMode === 'signup' ? '#16a34a' : 'transparent', color: authMode === 'signup' ? '#fff' : '#111827', border: 'none', borderRadius: '10px', padding: '10px 12px', fontWeight: '800', cursor: 'pointer' }}>
            Sign up
          </button>
        </div>

        <h3 style={{ margin: '0 0 14px', fontWeight: '800', fontSize: '18px', color: '#000' }}>
          {authMode === 'login' ? 'Welcome back' : 'Create your free account'}
        </h3>

        <div style={{ fontSize: '12px', color: '#475569', marginBottom: '10px', fontWeight: '700' }}>
          Use your email or WhatsApp number to verify your account before selling.
        </div>

        <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Email or WhatsApp number" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #000', marginBottom: '12px', boxSizing: 'border-box' }} />

        <div style={{ position: 'relative', marginBottom: '14px' }}>
          <input value={pass} onChange={e => setPass(e.target.value)} type={showPass ? 'text' : 'password'} placeholder="Password" style={{ width: '100%', padding: '14px 50px 14px 14px', borderRadius: '12px', border: '2px solid #000', boxSizing: 'border-box' }} />
          <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '8px', top: '8px', height: '36px', padding: '0 12px', borderRadius: '8px', border: '1px solid #000', background: '#fff', color: '#000', fontWeight: '700', cursor: 'pointer' }}>
            {showPass ? 'Hide' : 'Show'}
          </button>
        </div>

        <button onClick={onLogin} disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#22c55e', color: '#fff', fontWeight: '800', fontSize: '16px', marginBottom: '10px', cursor: 'pointer', opacity: loading ? 0.75 : 1 }}>
          {loading ? 'Working...' : authMode === 'login' ? 'Log in' : 'Create account'}
        </button>

        <button onClick={onClose} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #000', background: '#fff', color: '#000', fontWeight: '900', fontSize: '15px', boxShadow: '0 2px 0 #000', cursor: 'pointer' }}>
          Close
        </button>
      </div>
    </div>
  )
}

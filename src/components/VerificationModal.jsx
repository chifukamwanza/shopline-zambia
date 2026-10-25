export default function VerificationModal({ target, method, code, setCode, onVerify, onClose, expectedCode, user }) {
  const methodLabel = method === 'whatsapp' ? 'WhatsApp' : 'Email'
  const isDemo = !expectedCode || Number(expectedCode) < 100000

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: '#fff', width: '100%', maxWidth: '380px', borderRadius: '20px', padding: '20px', boxShadow: '0 12px 28px rgba(0,0,0,0.2)' }}>
        <button onClick={onClose} style={{ position: 'absolute', right: '12px', top: '12px', background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px', fontWeight: '800', cursor: 'pointer' }}>×</button>

        <h3 style={{ margin: '0 0 10px', fontWeight: '900', fontSize: '22px', color: '#111827' }}>Verify your account</h3>
        <p style={{ margin: '0 0 14px', color: '#475569', lineHeight: '1.5', fontSize: '14px' }}>
          We sent a 6-digit code to <b>{target}</b> via <b>{methodLabel}</b>.
        </p>

        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Enter 6-digit code"
          maxLength={6}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px solid #000', marginBottom: '12px', boxSizing: 'border-box', fontSize: '18px', letterSpacing: '0.2em', textAlign: 'center' }}
        />

        {isDemo && (
          <div style={{ background: '#ecfdf5', color: '#065f46', borderRadius: '10px', padding: '8px 10px', marginBottom: '12px', fontSize: '12px', fontWeight: '700' }}>
            Demo mode: use code <b>123456</b> for testing.
          </div>
        )}

        <button onClick={onVerify} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#16a34a', color: '#fff', fontWeight: '800', fontSize: '16px', cursor: 'pointer', marginBottom: '10px' }}>
          Verify account
        </button>

        <button onClick={onClose} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #000', background: '#fff', color: '#000', fontWeight: '800', cursor: 'pointer' }}>
          Maybe later
        </button>
      </div>
    </div>
  )
}

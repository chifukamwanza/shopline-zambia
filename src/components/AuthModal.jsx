export default function AuthModal({ contact, setContact, pass, setPass, showPass, setShowPass, onLogin, onClose, loading }){
  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
      <div style={{background:'#fff',width:'100%',maxWidth:'360px',borderRadius:'20px',padding:'20px'}}>
        <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Email or Phone" style={{width:'100%',padding:'12px',border:'2px solid #000',borderRadius:'12px',marginBottom:'10px',color:'#000',background:'#fff'}}/>
        <input value={pass} onChange={e=>setPass(e.target.value)} type={showPass?'text':'password'} placeholder="Password" style={{width:'100%',padding:'12px',border:'2px solid #000',borderRadius:'12px',marginBottom:'10px',color:'#000',background:'#fff'}}/>
        <button onClick={onLogin} disabled={loading} style={{width:'100%',padding:'12px',borderRadius:'12px',background:'#22c55e',color:'#fff',fontWeight:'800',marginBottom:'10px'}}>Log In</button>
        <button onClick={onClose} style={{width:'100%',padding:'12px',borderRadius:'12px',border:'2px solid #000',background:'#fff',color:'#000',fontWeight:'900',boxShadow:'0 2px 0 #000'}}>Cancel</button>
      </div>
    </div>
  )
}

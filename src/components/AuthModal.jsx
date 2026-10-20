export default function AuthModal({ contact, setContact, pass, setPass, showPass, setShowPass, onLogin, onClose, loading }){
  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
      <div style={{background:'#fff',width:'100%',maxWidth:'360px',borderRadius:'20px',padding:'20px',boxShadow:'0 10px 30px rgba(0,0,0,0.2)'}}>
        <h3 style={{margin:'0 0 14px',fontWeight:'800',fontSize:'18px',color:'#000'}}>Log In / Sign Up</h3>
        <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Email or Phone" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #000',marginBottom:'12px',color:'#000',background:'#fff',fontSize:'15px'}}/>
        <div style={{position:'relative',marginBottom:'14px'}}>
          <input value={pass} onChange={e=>setPass(e.target.value)} type={showPass?'text':'password'} placeholder="Password" style={{width:'100%',padding:'14px 50px 14px 14px',borderRadius:'12px',border:'2px solid #000',color:'#000',background:'#fff',fontSize:'15px'}}/>
          <button type="button" onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'8px',top:'8px',height:'36px',padding:'0 12px',borderRadius:'8px',border:'1px solid #000',background:'#fff',color:'#000',fontSize:'12px',fontWeight:'800',cursor:'pointer'}}>
            {showPass?'Hide':'Show'}
          </button>
        </div>
        <button onClick={onLogin} disabled={loading} style={{width:'100%',padding:'14px',borderRadius:'12px',border:'none',background:'#22c55e',color:'#fff',fontWeight:'800',fontSize:'16px',marginBottom:'10px',cursor:'pointer'}}>{loading?'Wait...':'Continue'}</button>
        <button onClick={onClose} style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #000',background:'#fff',color:'#000',fontWeight:'900',fontSize:'15px',boxShadow:'0 2px 0 #000',cursor:'pointer'}}>Cancel</button>
      </div>
    </div>
  )
}

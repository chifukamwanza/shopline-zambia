export default function AuthModal({ contact, setContact, pass, setPass, showPass, setShowPass, onLogin, onClose, loading }){
  return (
    <div style={{position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,0.55)',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px'}}>
      <div style={{background:'#fff',width:'100%',maxWidth:'360px',borderRadius:'20px',padding:'20px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
          <h2 style={{margin:0,fontSize:'20px',fontWeight:'800',color:'#000'}}>Log In / Sign Up</h2>
          <button onClick={onClose} style={{background:'#000',color:'#fff',border:'none',borderRadius:'50%',width:'36px',height:'36px',fontSize:'20px',cursor:'pointer'}}>X</button>
        </div>

        <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Email" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #000',marginBottom:'12px',color:'#000',background:'#fff',fontSize:'16px',fontWeight:'600'}}/>

        <div style={{position:'relative',marginBottom:'14px'}}>
          <input value={pass} onChange={e=>setPass(e.target.value)} type={showPass?'text':'password'} placeholder="Password / Passkey" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #000',color:'#000',background:'#fff',fontSize:'16px',fontWeight:'600'}}/>
          <button onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'8px',top:'8px',padding:'6px 10px',borderRadius:'8px',border:'1px solid #000',background:'#fff',color:'#000',fontSize:'12px',fontWeight:'800',cursor:'pointer'}}>{showPass?'Hide':'Show'}</button>
        </div>

        <button onClick={onLogin} disabled={loading} style={{width:'100%',padding:'14px',borderRadius:'12px',border:'none',background:'#22c55e',color:'#fff',fontWeight:'800',fontSize:'16px',cursor:'pointer',marginBottom:'12px'}}>{loading?'Please wait...':'Log In / Create Account'}</button>

        {/* NEW Attractive & Highly Visible Cancel */}
        <button onClick={onClose} style={{width:'100%',padding:'14px',borderRadius:'12px',border:'2px solid #000',background:'#fff',color:'#000',fontWeight:'900',fontSize:'16px',cursor:'pointer',boxShadow:'0 2px 0 #000'}}>Cancel</button>
      </div>
    </div>
  )
        }

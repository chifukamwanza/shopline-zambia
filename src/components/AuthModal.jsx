export default function AuthModal({ contact, setContact, pass, setPass, showPass, setShowPass, onLogin, onClose, loading }){
  return (
    <div onClick={onClose} style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'20px'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff',width:'100%',maxWidth:'380px',borderRadius:'16px',padding:'22px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
          <div style={{fontWeight:900,fontSize:'18px'}}>Log In / Sign Up</div>
          <button onClick={onClose} style={{border:'none',background:'#f3f4f6',width:'32px',height:'32px',borderRadius:'50%'}}>✕</button>
        </div>
        <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Email or Phone" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'1px solid #ddd',marginBottom:'12px',boxSizing:'border-box',fontSize:'16px'}}/>
        <div style={{position:'relative',marginBottom:'16px'}}>
          <input value={pass} onChange={e=>setPass(e.target.value)} type={showPass?'text':'password'} placeholder="Password" style={{width:'100%',padding:'14px 50px 14px 14px',borderRadius:'12px',border:'1px solid #ddd',boxSizing:'border-box',fontSize:'16px'}}/>
          <button onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'6px',top:'6px',border:'none',background:'#e8f5e9',color:'#16a34a',padding:'8px 12px',borderRadius:'8px',fontWeight:'bold',fontSize:'13px'}}>
            {showPass?'🙈 Hide':'👁️ Show'}
          </button>
        </div>
        <button onClick={onLogin} disabled={loading} style={{width:'100%',background:'#16a34a',color:'#fff',border:'none',padding:'15px',borderRadius:'12px',fontWeight:900,fontSize:'16px'}}>{loading?'Wait...':'Log In / Create Account'}</button>
      </div>
    </div>
  )
                                                               }

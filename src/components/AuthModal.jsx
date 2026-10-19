export default function AuthModal({ contact, setContact, pass, setPass, showPass, setShowPass, onLogin, onClose, loading }){
  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:50,padding:'20px'}}>
      <div style={{background:'#fff',width:'100%',maxWidth:'380px',borderRadius:'16px',padding:'20px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}}>
          <div style={{fontWeight:900,fontSize:'18px'}}>Log In / Sign Up</div>
          <button onClick={onClose} style={{border:'none',background:'#f3f4f6',width:'32px',height:'32px',borderRadius:'50%',fontWeight:'bold'}}>✕</button>
        </div>
        
        <div style={{fontSize:'13px',color:'#666',marginBottom:'12px'}}>Enter phone or email, we will create account automatically if new</div>
        
        <input 
          value={contact} 
          onChange={e=>setContact(e.target.value)} 
          placeholder="Email or Phone (e.g. 0971234567)" 
          style={{width:'100%',padding:'14px',borderRadius:'10px',border:'1px solid #ddd',marginBottom:'12px',boxSizing:'border-box',fontSize:'16px'}}
        />
        
        <div style={{position:'relative',marginBottom:'16px'}}>
          <input 
            value={pass} 
            onChange={e=>setPass(e.target.value)} 
            type={showPass?'text':'password'} 
            placeholder="Password (any 4+ chars)" 
            style={{width:'100%',padding:'14px',borderRadius:'10px',border:'1px solid #ddd',boxSizing:'border-box',fontSize:'16px'}}
          />
          <button onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'10px',top:'10px',border:'none',background:'none',fontSize:'12px'}}>{showPass?'Hide':'Show'}</button>
        </div>

        <button 
          onClick={()=>{
            console.log('LOGIN CLICK', contact, pass);
            if(!contact || !pass){ alert('Enter email/phone and password'); return; }
            onLogin();
          }} 
          disabled={loading}
          style={{width:'100%',background:'#16a34a',color:'#fff',border:'none',padding:'14px',borderRadius:'10px',fontWeight:900,fontSize:'16px'}}
        >
          {loading ? 'Please wait...' : 'Log In / Create Account'}
        </button>

        <div style={{textAlign:'center',fontSize:'12px',color:'#888',marginTop:'10px'}}>Instant login - No code needed</div>
      </div>
    </div>
  )
              }

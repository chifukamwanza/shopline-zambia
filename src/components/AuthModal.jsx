export default function AuthModal({ contact, setContact, pass, setPass, showPass, setShowPass, onLogin, onClose, loading }){
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'16px'}}>
      <div style={{background:'#fff',borderRadius:'20px',padding:'20px',width:'100%',maxWidth:'380px',position:'relative'}}>
        <button onClick={onClose} style={{position:'absolute',top:'12px',right:'12px',background:'#000',color:'#fff',border:'none',borderRadius:'50%',width:'38px',height:'38px',fontWeight:'bold',fontSize:'20px',cursor:'pointer'}}>✕</button>
        <h2 style={{fontSize:'20px',fontWeight:'bold',marginBottom:'16px',paddingRight:'40px'}}>Log In / Sign Up</h2>
        <input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Email e.g. chifukamwanza@gmail.com" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'1px solid #ddd',marginBottom:'12px',background:'#eef2ff',boxSizing:'border-box'}} />
        <div style={{position:'relative',marginBottom:'16px'}}>
          <input value={pass} onChange={e=>setPass(e.target.value)} type={showPass?'text':'password'} placeholder="Password" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'1px solid #ddd',boxSizing:'border-box'}} />
          <button onClick={()=>setShowPass(!showPass)} style={{position:'absolute',right:'8px',top:'8px',background:'#fff',border:'1px solid #ddd',borderRadius:'8px',padding:'6px 10px',fontSize:'12px'}}>{showPass?'Hide':'Show'}</button>
        </div>
        <button onClick={onLogin} disabled={loading} style={{width:'100%',background:'#00a651',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'bold',fontSize:'16px',cursor:'pointer'}}>{loading?'Please wait...':'Log In / Create Account'}</button>
        <button onClick={onClose} style={{width:'100%',marginTop:'10px',background:'#fff',color:'#000',border:'2px solid #000',padding:'12px',borderRadius:'12px',fontWeight:'bold',cursor:'pointer'}}>Cancel</button>
      </div>
    </div>
  )
}

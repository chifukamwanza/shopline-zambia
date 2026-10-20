export default function VerifyModal({ pendingUser, generatedCode, verifyInput, setVerifyInput, onConfirm, onBack, loading }){
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.6)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9999,padding:'16px'}}>
      <div style={{background:'#fff',borderRadius:'20px',padding:'20px',width:'100%',maxWidth:'380px',position:'relative'}}>
        <button onClick={onBack} style={{position:'absolute',top:'12px',right:'12px',background:'#000',color:'#fff',border:'none',borderRadius:'50%',width:'38px',height:'38px',fontWeight:'bold',fontSize:'20px'}}>✕</button>
        <h2 style={{fontSize:'20px',fontWeight:'bold',marginBottom:'8px',paddingRight:'40px'}}>Verify Email</h2>
        <p style={{fontSize:'13px',color:'#666',marginBottom:'12px'}}>Code: {generatedCode}</p>
        <input value={verifyInput} onChange={e=>setVerifyInput(e.target.value)} placeholder="Enter code" style={{width:'100%',padding:'14px',borderRadius:'12px',border:'1px solid #ddd',marginBottom:'12px',boxSizing:'border-box'}} />
        <button onClick={onConfirm} disabled={loading} style={{width:'100%',background:'#00a651',color:'#fff',border:'none',padding:'14px',borderRadius:'12px',fontWeight:'bold'}}>{loading?'Verifying...':'Confirm'}</button>
        <button onClick={onBack} style={{width:'100%',marginTop:'10px',background:'#fff',color:'#000',border:'2px solid #000',padding:'12px',borderRadius:'12px',fontWeight:'bold'}}>Cancel</button>
      </div>
    </div>
  )
}

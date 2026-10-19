import Logo from './Logo'

export default function Header({ user, search, setSearch, country, setCountry, allCountriesFilter, cat, setCat, cats, setShowSell, setShowProfile, setShowLogin, editCountry, editPic }){
  const picToShow = editPic || (user && user.pic) || ''
  const initial = user && user.name ? user.name.charAt(0).toUpperCase() : 'S'
  return (
    <>
      <header style={{background:'#fff',borderBottom:'1px solid #eee',position:'sticky',top:0,zIndex:10}}>
        <div style={{display:'flex',justifyContent:'space-between',padding:'10px 12px',alignItems:'center'}}>
          <Logo size={34} />
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            {user ? (
              <>
                <button onClick={()=>setShowSell(true)} style={{background:'#16a34a',color:'#fff',border:'none',padding:'10px 14px',borderRadius:'10px',fontWeight:'bold'}}>+ Sell</button>
                <div onClick={()=>setShowProfile(true)} style={{width:'42px',height:'42px',borderRadius:'50%',background:'#111',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:'bold',cursor:'pointer',border:'2px solid #16a34a',overflow:'hidden'}}>
                  {picToShow ? <img src={picToShow} alt="pic" style={{width:'42px',height:'42px',objectFit:'cover'}}/> : initial}
                </div>
              </>
            ) : (
              <button onClick={()=>setShowLogin(true)} style={{background:'#16a34a',color:'#fff',border:'none',padding:'10px 18px',borderRadius:'10px',fontWeight:'bold'}}>Log In</button>
            )}
          </div>
        </div>
      </header>
      <div style={{background:'linear-gradient(135deg,#14532d,#16a34a,#4ade80)',color:'#fff',padding:'18px 14px',maxWidth:'700px',margin:'0 auto'}}>
        <div style={{fontSize:'20px',fontWeight:900}}>{user ? `Welcome back, ${user.name}!` : 'Shopline'}</div>
        <div style={{fontSize:'13px',marginTop:'6px',opacity:0.95}}>Buy and Sell Anything, Anywhere - Verified Global Marketplace</div>
        <div style={{marginTop:'12px',display:'flex',gap:'8px'}}>
          <div style={{flex:1,position:'relative'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..." style={{width:'100%',padding:'12px 14px 12px 36px',borderRadius:'12px',border:'none',boxSizing:'border-box'}}/>
            <span style={{position:'absolute',left:'12px',top:'11px'}}>🔍</span>
          </div>
          <select value={country} onChange={e=>setCountry(e.target.value)} style={{padding:'12px 8px',borderRadius:'12px',border:'none',fontWeight:'bold',fontSize:'12px'}}>
            {allCountriesFilter.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div style={{background:'#fff',padding:'10px',display:'flex',gap:'8px',overflowX:'auto',maxWidth:'700px',margin:'0 auto',borderBottom:'1px solid #eee'}}>
        {cats.map(c=>(
          <button key={c.id} onClick={()=>setCat(c.id)} style={{background:cat===c.id?'#111':'#f3f4f6',color:cat===c.id?'#fff':'#111',border:'none',padding:'7px 12px',borderRadius:'18px',fontSize:'12px',fontWeight:'bold',flexShrink:0}}>{c.i} {c.l}</button>
        ))}
      </div>
    </>
  )
      }

import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'

const CATS = ['All','Phones','Clothes','Shoes','Bags','Beauty','Electronics','Home','Cars','Property','Jobs','Services','Food','Kids','Other']
const COUNTRIES = ['Zambia','Tanzania','Kenya','South Africa','Malawi','Zimbabwe','DRC','Uganda','Namibia','Botswana','Other']
const PROVINCES = ['Lusaka','Copperbelt','Central','Southern','Eastern','Northern','Western','North-Western','Luapula','Muchinga']

export default function App(){
  const [pg,setPg]=useState('home')
  const [u,setU]=useState(null)
  const [profile,setProfile]=useState(null)
  const [pr,setPr]=useState([])
  const [s,setS]=useState('')
  const [sc,setSc]=useState('All')
  const [mode,setMode]=useState('phone')
  const [e,setE]=useState('')
  const [pw,setPw]=useState('')
  const [showPw,setShowPw]=useState(false)
  const [phLogin,setPhLogin]=useState('')

  // Sell form
  const [nm,setNm]=useState('')
  const [pc,setPc]=useState('')
  const [desc,setDesc]=useState('')
  const [im,setIm]=useState('')
  const [uping,setUping]=useState(false)
  const [ph,setPh]=useState('')
  const [loc,setLoc]=useState('')
  const [prov,setProv]=useState('Lusaka')
  const [country,setCountry]=useState('Zambia')
  const [pay,setPay]=useState('Cash')

  // Profile form
  const [shopName,setShopName]=useState('')
  const [displayName,setDisplayName]=useState('')

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>setU(data.session?.user||null))
    supabase.auth.onAuthStateChange((_,sess)=>setU(sess?.user||null))
    load()
  },[])

  useEffect(()=>{ if(u) loadProfile() },[u])

  async function loadProfile(){
    let {data}=await supabase.from('profiles').select('*').eq('id',u.id).single()
    if(data){ setProfile(data); setShopName(data.shop_name||''); setDisplayName(data.display_name||''); setCountry(data.country||'Zambia'); setProv(data.province||'Lusaka'); setLoc(data.town||''); setPh(data.phone||''); }
  }

  async function load(){
    let {data}=await supabase.from('products').select('*').order('id',{ascending:false})
    if(data) setPr(data)
  }

  async function uploadFile(ev){
    let f=ev.target.files[0]; if(!f) return
    setUping(true)
    let n=Date.now()+'_'+f.name
    let {error}=await supabase.storage.from('product-images').upload(n,f)
    if(error){ alert(error.message); setUping(false); return }
    let {data}=supabase.storage.from('product-images').getPublicUrl(n)
    setIm(data.publicUrl); setUping(false)
  }

  async function saveProfile(ev){
    ev.preventDefault()
    if(!u) return
    let {error}=await supabase.from('profiles').upsert({
      id:u.id, shop_name:shopName, display_name:displayName,
      phone:ph, country:country, province:prov, town:loc
    })
    if(error) alert(error.message)
    else{ alert('Profile saved!'); loadProfile(); setPg('sell') }
  }

  async function add(ev){
    ev.preventDefault()
    if(!u) return setPg('auth')
    let {error}=await supabase.from('products').insert([{
      name:nm, price:Number(pc), description:desc, image_url:im,
      category:'Phones', seller_id:u.id, seller_name:shopName||displayName||u.email,
      phone:ph, location:loc, province:prov, country:country, payment:pay
    }])
    if(error) alert(error.message)
    else{ setNm(''); setPc(''); setDesc(''); setIm(''); load(); setPg('home'); alert('Live on open market!') }
  }

  async function loginEmail(){
    let r=await supabase.auth.signInWithPassword({email:e,password:pw})
    if(r.error){
      let q=await supabase.auth.signUp({email:e,password:pw})
      if(q.error) alert(q.error.message)
      else{ alert('Account created!'); setU(q.data.user); setPg('profile') }
    } else { setU(r.data.user); setPg('profile') }
  }

  async function loginPhone(){
    if(phLogin.length<9) return alert('Enter valid phone')
    if(pw.length<6) return alert('Password 6+ chars')
    let digits=phLogin.replace(/\D/g,'')
    let fake='user'+digits+'@phone.shopline.com'
    let r=await supabase.auth.signInWithPassword({email:fake,password:pw})
    if(r.error){
      let q=await supabase.auth.signUp({email:fake,password:pw})
      if(q.error) alert(q.error.message)
      else{ alert('Account for '+phLogin+' created!'); setU(q.data.user); setPg('profile') }
    } else { setU(r.data.user); setPg('profile') }
  }

  function niceUser(){
    if(profile?.shop_name) return profile.shop_name
    if(profile?.display_name) return profile.display_name
    if(profile?.phone) return profile.phone
    if(u?.email?.startsWith('user')) return phLogin||profile?.phone||'My Shop'
    return u?.email||'My Shop'
  }

  let list=pr.filter(x=> x.name.toLowerCase().includes(s.toLowerCase()) && (sc==='All'||x.category===sc) )

  return(
    <>
      <header style={{padding:10,display:'flex',justifyContent:'space-between',background:'#fff',borderBottom:'1px solid #eee',position:'sticky',top:0,zIndex:10}}>
        <b onClick={()=>setPg('home')} style={{color:'#16a34a'}}>Shopline 🛍️ Free Market</b>
        <div style={{display:'flex',gap:6}}>
          <button onClick={()=>setPg('home')} style={{padding:'7px 12px',borderRadius:999,border:'2px solid #16a34a',background:'#fff',color:'#16a34a',fontWeight:800,fontSize:12}}>Buy</button>
          <button onClick={()=>setPg(u?'sell':'auth')} style={{padding:'7px 12px',borderRadius:999,border:0,background:'#16a34a',color:'#fff',fontWeight:800,fontSize:12}}>Sell</button>
          {u && <button onClick={()=>setPg('profile')} style={{padding:'7px 12px',borderRadius:999,border:0,background:'#eee',fontWeight:800,fontSize:12}}>👤</button>}
        </div>
      </header>

      {pg==='home' && (
        <div style={{padding:12,background:'#f0fdf4',minHeight:'90vh'}}>
          <h3 style={{textAlign:'center'}}>Zambia Open Market 🌍</h3>
          <input value={s} onChange={x=>setS(x.target.value)} placeholder='Search...' style={{display:'block',margin:'8px auto',padding:10,borderRadius:999,border:'1px solid #ddd',width:'90%',maxWidth:400}}/>
          <div style={{display:'flex',gap:4,flexWrap:'wrap',justifyContent:'center'}}>
            {CATS.map(x=> <button key={x} onClick={()=>setSc(x)} style={{padding:'4px 8px',borderRadius:999,border:'1px solid #ddd',background:sc===x?'#16a34a':'#fff',color:sc===x?'#fff':'#333',fontSize:11}}>{x}</button> )}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:12}}>
            {list.map(x=>(
              <div key={x.id} style={{background:'#fff',borderRadius:12,overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
                <img src={x.image_url} style={{width:'100%',height:120,objectFit:'cover'}}/>
                <div style={{padding:6}}>
                  <div style={{fontSize:12,fontWeight:700}}>{x.name}</div>
                  <div style={{fontSize:9,color:'#666'}}>{x.country||'Zambia'} • {x.province||''}</div>
                  <div style={{fontSize:10,color:'#666',margin:'2px 0',height:28,overflow:'hidden'}}>{x.description||'No description'}</div>
                  <div style={{fontWeight:900,color:'#16a34a'}}>K{Number(x.price||0).toLocaleString()}</div>
                  <div style={{fontSize:9,color:'#999'}}>{x.seller_name}</div>
                  <button onClick={()=>window.open('https://wa.me/'+(x.phone||'').replace(/\D/g,'')+'?text=Hi I want '+encodeURIComponent(x.name),'_blank')} style={{width:'100%',background:'#25D366',color:'#fff',border:0,padding:6,borderRadius:6,marginTop:4,fontSize:11,fontWeight:800}}>WhatsApp</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pg==='profile' && (
        <div style={{padding:12}}>
          <div style={{maxWidth:480,margin:'0 auto',background:'#fff',padding:14,borderRadius:12}}>
            <h3>👤 My Shop Profile</h3>
            <p style={{fontSize:11,color:'#666'}}>Set your name and country — buyers will see this, not the ugly email.</p>
            <form onSubmit={saveProfile} style={{display:'grid',gap:8}}>
              <input value={shopName} onChange={x=>setShopName(x.target.value)} placeholder='Shop Name e.g. Chifuka Phones' required style={{padding:10,border:'1px solid #ddd',borderRadius:8}}/>
              <input value={displayName} onChange={x=>setDisplayName(x.target.value)} placeholder='Your Name e.g. Chifuka Mwanza' required style={{padding:10,border:'1px solid #ddd',borderRadius:8}}/>
              <input value={ph} onChange={x=>setPh(x.target.value)} placeholder='Phone e.g. 0979879657' required style={{padding:10,border:'1px solid #ddd',borderRadius:8}}/>
              <select value={country} onChange={x=>setCountry(x.target.value)} style={{padding:10,border:'1px solid #ddd',borderRadius:8}}>
                {COUNTRIES.map(c=> <option key={c}>{c}</option>)}
              </select>
              <div style={{display:'flex',gap:6}}>
                <select value={prov} onChange={x=>setProv(x.target.value)} style={{padding:10,border:'1px solid #ddd',borderRadius:8,flex:1}}>
                  {PROVINCES.map(p=> <option key={p}>{p}</option>)}
                </select>
                <input value={loc} onChange={x=>setLoc(x.target.value)} placeholder='Town' style={{padding:10,border:'1px solid #ddd',borderRadius:8,flex:1}}/>
              </div>
              <button style={{background:'#16a34a',color:'#fff',padding:12,borderRadius:8,border:0,fontWeight:900}}>Save Profile & Continue to Sell</button>
            </form>
            <button onClick={()=>setPg('home')} style={{marginTop:10,width:'100%',background:'#eee',border:0,padding:8,borderRadius:8}}>← Back to Market</button>
          </div>
        </div>
      )}

      {pg==='sell' && (
        <div style={{padding:12}}>
          <div style={{maxWidth:480,margin:'0 auto'}}>
            <h3>Sell Anything</h3>
            <p style={{fontSize:11,color:'#666'}}>As <b>{niceUser()}</b> • {country}</p>
            <form onSubmit={add} style={{display:'grid',gap:8,background:'#fff',padding:12,borderRadius:12}}>
              <input value={nm} onChange={x=>setNm(x.target.value)} placeholder='Product e.g. iPhone 13' required style={{padding:10,border:'1px solid #ddd',borderRadius:8}}/>
              <input value={pc} onChange={x=>setPc(x.target.value)} placeholder='Price K' type='number' required style={{padding:10,border:'1px solid #ddd',borderRadius:8}}/>
              <textarea value={desc} onChange={x=>setDesc(x.target.value)} placeholder='Description e.g. Neat, 1 year used, with box...' rows={3} required style={{padding:10,border:'1px solid #ddd',borderRadius:8}}></textarea>
              <div style={{border:'2px dashed #16a34a',borderRadius:8,padding:10,textAlign:'center'}}>
                <input type='file' accept='image/*' onChange={uploadFile}/>
                <div style={{fontSize:11}}>{uping?'Uploading...':im?'✅ Photo ready':'📸 Upload photo'}</div>
                {im && <img src={im} style={{width:'100%',height:100,objectFit:'cover',marginTop:6}}/>}
              </div>
              <input value={ph} onChange={x=>setPh(x.target.value)} placeholder='WhatsApp 260...' required style={{padding:10,border:'1px solid #ddd',borderRadius:8}}/>
              <div style={{display:'flex',gap:6}}>
                <select value={country} onChange={x=>setCountry(x.target.value)} style={{padding:10,border:'1px solid #ddd',borderRadius:8,flex:1}}>
                  {COUNTRIES.map(c=> <option key={c}>{c}</option>)}
                </select>
                <select value={prov} onChange={x=>setProv(x.target.value)} style={{padding:10,border:'1px solid #ddd',borderRadius:8,flex:1}}>
                  {PROVINCES.map(p=> <option key={p}>{p}</option>)}
                </select>
              </div>
              <input value={loc} onChange={x=>setLoc(x.target.value)} placeholder='Town' style={{padding:10,border:'1px solid #ddd',borderRadius:8}}/>
              <select value={pay} onChange={x=>setPay(x.target.value)} style={{padding:10,border:'1px solid #ddd',borderRadius:8}}><option>Cash</option><option>M-Pesa</option><option>Airtel Money</option><option>Bank</option></select>
              <button disabled={!im||uping} style={{background:!im?'#9ca3af':'#16a34a',color:'#fff',padding:12,borderRadius:8,border:0,fontWeight:900}}>Publish Free</button>
            </form>
            <div style={{display:'flex',gap:6,marginTop:10}}>
              <button onClick={()=>setPg('home')} style={{flex:1,background:'#eee',border:0,padding:8,borderRadius:8}}>← Market</button>
              <button onClick={()=>setPg('profile')} style={{flex:1,background:'#fff',border:'1px solid #ddd',padding:8,borderRadius:8}}>Edit Profile</button>
            </div>
          </div>
        </div>
      )}

      {pg==='auth' && (
        <div style={{padding:20}}>
          <div style={{maxWidth:380,margin:'0 auto',background:'#fff',padding:16,borderRadius:16}}>
            <h3 style={{textAlign:'center'}}>Join Shopline - Free</h3>
            <div style={{display:'flex',gap:6,justifyContent:'center',marginBottom:10}}>
              <button onClick={()=>setMode('email')} style={{padding:'6px 12px',borderRadius:999,border:'1px solid #ddd',background:mode==='email'?'#16a34a':'#fff',color:mode==='email'?'#fff':'#333',fontWeight:700}}>Email</button>
              <button onClick={()=>setMode('phone')} style={{padding:'6px 12px',borderRadius:999,border:'1px solid #ddd',background:mode==='phone'?'#16a34a':'#fff',color:mode==='phone'?'#fff':'#333',fontWeight:700}}>Phone</button>
            </div>
            {mode==='email' && (
              <div>
                <input value={e} onChange={x=>setE(x.target.value)} placeholder='Email' style={{padding:10,borderRadius:8,border:'1px solid #ddd',width:'90%'}}/>
                <div style={{position:'relative',marginTop:8,width:'96%'}}>
                  <input value={pw} onChange={x=>setPw(x.target.value)} placeholder='Create password' type={showPw?'text':'password'} style={{padding:'10px 40px 10px 10px',borderRadius:8,border:'1px solid #ddd',width:'100%',boxSizing:'border-box'}}/>
                  <span onClick={()=>setShowPw(!showPw)} style={{position:'absolute',right:10,top:8,cursor:'pointer'}}>{showPw?'🙈':'👁️'}</span>
                </div>
                <button onClick={loginEmail} style={{background:'#16a34a',color:'#fff',padding:10,borderRadius:8,border:0,width:'100%',marginTop:10,fontWeight:800}}>Create Account / Login</button>
              </div>
            )}
            {mode==='phone' && (
              <div>
                <input value={phLogin} onChange={x=>setPhLogin(x.target.value)} placeholder='Phone e.g. 0979879657' style={{padding:10,borderRadius:8,border:'1px solid #ddd',width:'90%'}}/>
                <div style={{position:'relative',marginTop:8,width:'96%'}}>
                  <input value={pw} onChange={x=>setPw(x.target.value)} placeholder='Create password 6+ chars' type={showPw?'text':'password'} style={{padding:'10px 40px 10px 10px',borderRadius:8,border:'1px solid #ddd',width:'100%',boxSizing:'border-box'}}/>
                  <span onClick={()=>setShowPw(!showPw)} style={{position:'absolute',right:10,top:8,cursor:'pointer'}}>{showPw?'🙈':'👁️'}</span>
                </div>
                <button onClick={loginPhone} style={{background:'#16a34a',color:'#fff',padding:10,borderRadius:8,border:0,width:'100%',marginTop:8,fontWeight:800}}>Create Account / Login with Phone</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
      }

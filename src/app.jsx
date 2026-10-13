import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase.js'

const C = ['All','Phones','Clothes','Shoes','Bags','Beauty','Electronics','Home','Cars','Property','Jobs','Services','Food','Kids','Other']

export default function App(){
  const [pg,setPg]=useState('home')
  const [u,setU]=useState(null)
  const [pr,setPr]=useState([])
  const [s,setS]=useState('')
  const [sc,setSc]=useState('All')
  const [mode,setMode]=useState('phone')
  const [e,setE]=useState('')
  const [pw,setPw]=useState('')
  const [showPw,setShowPw]=useState(false)
  const [phLogin,setPhLogin]=useState('')
  const [nm,setNm]=useState('')
  const [pc,setPc]=useState('')
  const [desc,setDesc]=useState('')
  const [im,setIm]=useState('')
  const [uping,setUping]=useState(false)
  const [ph,setPh]=useState('')
  const [loc,setLoc]=useState('')
  const [prov,setProv]=useState('Lusaka')
  const [pay,setPay]=useState('Cash')

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>setU(data.session?.user||null))
    supabase.auth.onAuthStateChange((_,sess)=>setU(sess?.user||null))
    load()
  },[])

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

  async function add(ev){
    ev.preventDefault()
    if(!u) return setPg('auth')
    let {error}=await supabase.from('products').insert([{
      name:nm, price:Number(pc), description:desc, image_url:im,
      category:'Phones', seller_id:u.id, seller_name:u.email,
      phone:ph, location:loc, province:prov, payment:pay
    }])
    if(error) alert(error.message)
    else{ setNm(''); setPc(''); setDesc(''); setIm(''); setPh(''); setLoc(''); load(); setPg('home'); alert('Live on open market!') }
  }

  async function loginEmail(){
    let r=await supabase.auth.signInWithPassword({email:e,password:pw})
    if(r.error){
      let q=await supabase.auth.signUp({email:e,password:pw})
      if(q.error) alert(q.error.message)
      else{ alert('Account created!'); setU(q.data.user); setPg('sell') }
    } else { setU(r.data.user); setPg('sell') }
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
      else{ alert('Account for '+phLogin+' created!'); setU(q.data.user); setPg('sell') }
    } else { setU(r.data.user); setPg('sell') }
  }

  let list=pr.filter(x=> x.name.toLowerCase().includes(s.toLowerCase()) && (sc==='All'||x.category===sc) )

  return(
    <>
      <header style={{padding:10,display:'flex',justifyContent:'space-between',background:'#fff',borderBottom:'1px solid #eee',position:'sticky',top:0,zIndex:10}}>
        <b onClick={()=>setPg('home')} style={{color:'#16a34a'}}>Shopline 🛍️ Free Market</b>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setPg('home')} style={{padding:'7px 14px',borderRadius:999,border:'2px solid #16a34a',background:'#fff',color:'#16a34a',fontWeight:800,fontSize:13}}>Buy</button>
          <button onClick={()=>setPg(u?'sell':'auth')} style={{padding:'8px 14px',borderRadius:999,border:0,background:'#16a34a',color:'#fff',fontWeight:800,fontSize:13}}>Sell</button>
        </div>
      </header>

      {pg==='home' && (
        <div style={{padding:12,background:'#f0fdf4',minHeight:'90vh'}}>
          <h3 style={{textAlign:'center'}}>Zambia Open Market</h3>
          <input value={s} onChange={x=>setS(x.target.value)} placeholder='Search...' style={{display:'block',margin:'8px auto',padding:10,borderRadius:999,border:'1px solid #ddd',width:'90%',maxWidth:400}}/>
          <div style={{display:'flex',gap:4,flexWrap:'wrap',justifyContent:'center'}}>
            {C.map(x=> <button key={x} onClick={()=>setSc(x)} style={{padding:'4px 8px',borderRadius:999,border:'1px solid #ddd',background:sc===x?'#16a34a':'#fff',color:sc===x?'#fff':'#333',fontSize:11}}>{x}</button> )}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:10}}>
            {list.map(x=>(
              <div key={x.id} style={{background:'#fff',borderRadius:12,overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
                <img src={x.image_url} style={{width:'100%',height:120,objectFit:'cover'}}/>
                <div style={{padding:6}}>
                  <div style={{fontSize:12,fontWeight:700}}>{x.name}</div>
                  <div style={{fontSize:10,color:'#666',margin:'2px 0',height:28,overflow:'hidden'}}>{x.description||'No description'}</div>
                  <div style={{fontWeight:900,color:'#16a34a'}}>K{Number(x.price||0).toLocaleString()}</div>
                  <button onClick={()=>window.open('https://wa.me/'+(x.phone||'').replace(/\D/g,'')+'?text=Hi I want '+encodeURIComponent(x.name),'_blank')} style={{width:'100%',background:'#25D366',color:'#fff',border:0,padding:6,borderRadius:6,marginTop:4,fontSize:11,fontWeight:800}}>WhatsApp</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pg==='sell' && (
        <div style={{padding:12}}>
          <div style={{maxWidth:480,margin:'0 auto'}}>
            <h3>Sell Anything</h3>
            <p style={{fontSize:11,color:'#666'}}>As {u?.email}</p>
            <form onSubmit={add} style={{display:'grid',gap:8,background:'#fff',padding:12,borderRadius:12}}>
              <input value={nm} onChange={x=>setNm(x.target.value)} placeholder='Product e.g. iPhone 13' required style={{padding:10,border:'1px solid #ddd',borderRadius:8}}/>
              <input value={pc} onChange={

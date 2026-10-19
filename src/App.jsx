import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import safeStorage from './safeStorage'
import Header from './components/Header'
import AuthModal from './components/AuthModal'
import VerifyModal from './components/VerifyModal'
import ProfileModal from './components/ProfileModal'
import SellModal from './components/SellModal'
import ProductCard from './components/ProductCard'

const cats = [
  { id: 'All', l: 'All', i: '★' }, { id: 'Trending', l: 'Trending', i: '🔥' },
  { id: 'Phones', l: 'Phones', i: '📱' }, { id: 'Laptops', l: 'Laptops', i: '💻' },
  { id: 'Electronics', l: 'Electronics', i: '🔌' }, { id: 'Fashion Men', l: 'Men', i: '👕' },
  { id: 'Fashion Women', l: 'Women', i: '👗' }, { id: 'Shoes', l: 'Shoes', i: '👟' },
  { id: 'Beauty', l: 'Beauty', i: '💄' }, { id: 'Home', l: 'Home', i: '🏠' },
  { id: 'Vehicles', l: 'Vehicles', i: '🚗' }, { id: 'Property', l: 'Property', i: '🏢' },
  { id: 'Food', l: 'Food', i: '🍎' }, { id: 'Livestock', l: 'Livestock', i: '🐄' },
  { id: 'Farming', l: 'Farming', i: '🌾' }, { id: 'Services', l: 'Services', i: '🔧' },
  { id: 'Jobs', l: 'Jobs', i: '💼' }, { id: 'Kids', l: 'Kids', i: '👶' },
  { id: 'Sports', l: 'Sports', i: '⚽' }, { id: 'Books', l: 'Books', i: '📚' },
  { id: 'Pets', l: 'Pets', i: '🐶' }
]

const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Côte d'Ivoire","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Congo-Brazzaville)","Costa Rica","Croatia","Cuba","Cyprus","Czechia (Czech Republic)","Democratic Republic of the Congo","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini (fmr. Swaziland)","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Holy See","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"]
const allCountriesFilter = ['All Countries', ...countries]

export default function App(){
  const [user,setUser]=useState(()=>safeStorage.read('shopline_user'))
  const [showLogin,setShowLogin]=useState(false)
  const [showVerify,setShowVerify]=useState(false)
  const [showProfile,setShowProfile]=useState(false)
  const [showSell,setShowSell]=useState(false)
  const [contact,setContact]=useState('')
  const [pass,setPass]=useState('')
  const [showPass,setShowPass]=useState(false)
  const [verifyInput,setVerifyInput]=useState('')
  const [generatedCode,setGeneratedCode]=useState('')
  const [pendingUser,setPendingUser]=useState(null)
  const [loading,setLoading]=useState(false)
  const [editName,setEditName]=useState(user?.name||'')
  const [editBio,setEditBio]=useState(user?.bio||'')
  const [editCountry,setEditCountry]=useState(user?.userCountry||'Global')
  const [editTown,setEditTown]=useState(user?.town||'')
  const [editPhone,setEditPhone]=useState(user?.phone||'')
  const [editPic,setEditPic]=useState(user?.pic||'')
  const [search,setSearch]=useState('')
  const [cat,setCat]=useState('All')
  const [country,setCountry]=useState('All Countries')
  const [t,setT]=useState(''); const [d,setD]=useState(''); const [p,setP]=useState(''); const [loc,setLoc]=useState(''); const [nc,setNc]=useState('Phones'); const [nCountry,setNCountry]=useState('Zambia'); const [img,setImg]=useState('')
  const [products,setProducts]=useState([{id:1,title:'iPhone 13 Pro',desc:'Very clean 256GB',price:'K8500',location:'Lusaka',country:'Zambia',cat:'Phones',owner:'test@test.com'},{id:2,title:'Toyota Hilux',desc:'2009 2.7L',price:'K120000',location:'Lusaka',country:'Zambia',cat:'Vehicles',owner:'seller@cars.test'}])

  useEffect(()=>{ if(user){ setEditName(user.name||''); setEditBio(user.bio||''); setEditCountry(user.userCountry||'Global'); setEditTown(user.town||''); setEditPhone(user.phone||''); setEditPic(user.pic||'') } },[user])
  useEffect(()=>{ document.title = cat==='All' ? `Shopline - Buy & Sell Anything | ${country}` : `${cat} for Sale in ${country} | Shopline` },[cat,country])

  // FIXED LOGIN - 100% WORKS OFFLINE
  const login=()=>{
    if(!contact||!pass) return alert('Enter email/phone and password');
    const v = contact.trim();
    if(v.length < 3) return alert('Enter valid email or phone');
    const email = v.includes('@') ? v.toLowerCase() : `${v}@phone.shopline`;
    const saved = safeStorage.read('shopline_users') || {};
    let found = saved[email] || saved[v.toLowerCase()] || saved[v];
    if(!found){
      for(let k in saved){ if(saved[k].phone===v || saved[k].email===v.toLowerCase()){ found=saved[k]; break } }
    }
    if(found){
      if(found.password !== pass) return alert('Wrong password');
      safeStorage.write('shopline_user', found);
      setUser(found);
    } else {
      // New user -> start verification flow (email or SMS)
      const newUser = {
        email: email,
        phone: v.includes('@') ? '' : v,
        password: pass,
        name: v.includes('@') ? v.split('@')[0] : v,
        userCountry: 'Global',
        town: '',
        bio: '',
        pic: '',
        verified: false
      };

      // generate 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);
      setPendingUser(newUser);
      setShowVerify(true);

      // attempt to trigger email or sms composer (best-effort, free)
      try{
        if(v.includes('@')){
          // open mail client with code in body (user still sees code in modal)
          const subject = encodeURIComponent('Shopline verification code');
          const body = encodeURIComponent(`Your Shopline verification code is: ${code}`);
          window.open(`mailto:${email}?subject=${subject}&body=${body}`);
          alert('Verification code prepared in your email app (also shown on screen)');
        } else {
          // open SMS composer on mobile (may not work on all desktop browsers)
          const smsBody = encodeURIComponent(`Your Shopline verification code is: ${code}`);
          // try both sms: and sms:// for compatibility
          window.open(`sms:${v}?body=${smsBody}`);
          alert('Verification code prepared in your SMS app (also shown on screen)');
        }
      }catch(e){
        // ignore errors - code is visible in modal anyway
      }

      // do NOT persist user yet - wait for verification
    }
    setShowLogin(false);
    setContact('');
    setPass('');
  }

  const confirmVerify=async()=>{
    if(verifyInput!==generatedCode) return alert('Wrong code: '+generatedCode);
    if(!pendingUser) return alert('No pending user');
    setLoading(true);
    try{
      const userToSave = {...pendingUser, verified:true};

      // save locally
      const saved = safeStorage.read('shopline_users') || {};
      saved[userToSave.email] = userToSave;
      if(userToSave.phone) saved[userToSave.phone] = userToSave;
      safeStorage.write('shopline_users', saved);
      safeStorage.write('shopline_user', userToSave);
      setUser(userToSave);

      // try to save to supabase if available (best-effort)
      try{ await supabase.from('users').insert([userToSave]).then(()=>{}) }catch(e){}

      setShowVerify(false);
      setVerifyInput('');
      setPendingUser(null);
      setGeneratedCode('');
      alert('Account verified and created!');
    }catch(e){
      alert(e.message||'Error creating account');
    }
    setLoading(false);
  }
  const updateProfile=async()=>{ if(!editName) return alert('Enter name'); const updated={...user,name:editName,bio:editBio,userCountry:editCountry,town:editTown,phone:editPhone||user.phone,pic:editPic||user?.pic}; safeStorage.write('shopline_user', updated); try{ const m=safeStorage.read('shopline_profiles')||{}; m[updated.email]=updated; safeStorage.write('shopline_profiles', m) }catch{}; setUser(updated); setLoading(true); try{ await supabase.from('users').update({name:editName,phone:editPhone}).eq('email', user.email) }catch{}; setLoading(false); alert('Profile saved!'); setShowProfile(false) }
  const sell=()=>{ if(!t||!p) return alert('Add title & price'); const np={id:Date.now(),title:t,desc:d,price:p.startsWith('K')?p:'K'+p,location:loc||editTown||'Global',country:nCountry||editCountry,cat:nc,image:img,owner:user?.email}; setProducts([np,...products]); setT(''); setD(''); setP(''); setLoc(''); setImg(''); setShowSell(false) }

  let filtered=cat==='All'?products:cat==='Trending'?products.slice(0,8):products.filter(x=>x.cat===cat)
  if(country!=='All Countries') filtered=filtered.filter(x=>x.country===country)
  if(search) filtered=filtered.filter(x=>x.title.toLowerCase().includes(search.toLowerCase()))
  const myAds=products.filter(pr=>pr.owner===user?.email)

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'Arial'}}>
      <Header user={user} search={search} setSearch={setSearch} country={country} setCountry={setCountry} allCountriesFilter={allCountriesFilter} cat={cat} setCat={setCat} cats={cats} setShowSell={()=>setShowSell(true)} setShowLogin={()=>setShowLogin(true)} setShowProfile={()=>setShowProfile(true)} />
      <div style={{padding:'10px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',maxWidth:'700px',margin:'0 auto'}}>
        {filtered.map(pr=> <ProductCard key={pr.id} pr={pr} cats={cats} />)}
      </div>
      {showProfile && <ProfileModal user={user} editName={editName} setEditName={setEditName} editBio={editBio} setEditBio={setEditBio} editCountry={editCountry} setEditCountry={setEditCountry} editTown={editTown} setEditTown={setEditTown} editPhone={editPhone} setEditPhone={setEditPhone} editPic={editPic} setEditPic={setEditPic} onSave={updateProfile} onClose={()=>setShowProfile(false)} onLogout={()=>{ safeStorage.write('shopline_user', null); setUser(null); setShowProfile(false) }} myAds={myAds} loading={loading} />}
      {showLogin && <AuthModal contact={contact} setContact={setContact} pass={pass} setPass={setPass} showPass={showPass} setShowPass={setShowPass} onLogin={login} onClose={()=>setShowLogin(false)} loading={loading} />}
      {showVerify && <VerifyModal show={showVerify} pendingUser={pendingUser} generatedCode={generatedCode} verifyInput={verifyInput} setVerifyInput={setVerifyInput} onConfirm={confirmVerify} onBack={()=>{ setShowVerify(false); setPendingUser(null); setGeneratedCode(''); setVerifyInput(''); }} loading={loading} />}
      {showSell && <SellModal t={t} setT={setT} d={d} setD={setD} p={p} setP={setP} loc={loc} setLoc={setLoc} nc={nc} setNc={setNc} nCountry={nCountry} setNCountry={setNCountry} img={img} setImg={setImg} onCreate={sell} onClose={()=>setShowSell(false)} />}
    </div>
  )
                   }

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

const countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"]
const allCountriesFilter = ['All Countries', ...countries]

export default function App(){
  const [user,setUser]=useState(()=>safeStorage.read('shopline_user'))
  const [products,setProducts]=useState([])
  const [search,setSearch]=useState('')
  const [country,setCountry]=useState('All Countries')
  const [cat,setCat]=useState('All')
  
  const [showLogin,setShowLogin]=useState(false)
  const [showVerify,setShowVerify]=useState(false)
  const [showProfile,setShowProfile]=useState(false)
  const [showSell,setShowSell]=useState(false)
  const [contact,setContact]=useState('')
  const [pass,setPass]=useState('')
  const [showPass,setShowPass]=useState(false)
  const [loading,setLoading]=useState(false)
  
  const [t,setT]=useState(''); const [d,setD]=useState(''); const [p,setP]=useState('')
  const [loc,setLoc]=useState(''); const [nc,setNc]=useState('Phones'); const [nCountry,setNCountry]=useState('Zambia')
  const [img,setImg]=useState('')
  const [editingProduct,setEditingProduct]=useState(null)

  const [editName,setEditName]=useState(''); const [editBio,setEditBio]=useState('')
  const [editCountry,setEditCountry]=useState('Zambia'); const [editTown,setEditTown]=useState('')
  const [editPhone,setEditPhone]=useState(''); const [editPic,setEditPic]=useState('')
  
  const [verifyInput,setVerifyInput]=useState(''); const [generatedCode,setGeneratedCode]=useState('')
  const [pendingUser,setPendingUser]=useState(null)

  useEffect(()=>{
    async function fetchProducts(){
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if(error){ console.error(error.message) }
      else if(data){
        const mapped = data.map(pr => ({
          id: pr.id,
          title: pr.title || pr.name || 'Untitled',
          desc: pr.description || '',
          price: pr.price || '',
          location: pr.location || 'Zambia',
          country: pr.country || 'Zambia',
          cat: pr.category || 'All',
          image: pr.image_url || pr.image || '',
          owner: pr.owner_email || '',
          seller_id: pr.seller_id || ''
        }));
        setProducts(mapped);
      }
    }
    fetchProducts();
  }, [])

  const login=async()=>{
    if(!contact||!pass) return alert('Enter contact & password');
    setLoading(true);
    try{
      const { data, error } = await supabase.from('users').select('*').eq('email', contact).single();
      if(error || !data) throw new Error('User not found');
      if(data.password !== pass) throw new Error('Wrong password');
      safeStorage.write('shopline_user', data);
      setUser(data);
      setEditName(data.name||''); setEditBio(data.bio||''); setEditCountry(data.userCountry||'Zambia'); setEditTown(data.town||''); setEditPhone(data.phone||''); setEditPic(data.pic||'');
      setShowLogin(false); setContact(''); setPass('');
    }catch(e){ alert(e.message) }
    setLoading(false);
  }

  const confirmVerify=async()=>{ 
    if(verifyInput!==generatedCode) return alert('Wrong code: '+generatedCode); 
    setLoading(true); 
    try{ 
      const {data:nu}=await supabase.from('users').insert([{...pendingUser,verified:true}]).select().single(); 
      if(nu){ safeStorage.write('shopline_user', nu); setUser(nu) } 
      setShowVerify(false); setVerifyInput(''); setPendingUser(null); setContact(''); setPass('') 
    }catch(e){ alert(e.message) } 
    setLoading(false) 
  }
  
  const updateProfile=async()=>{
    if(!editName) return alert('Enter name');
    const updated={...user,name:editName,bio:editBio,userCountry:editCountry,town:editTown,phone:editPhone||user.phone,pic:editPic||user?.pic};
    safeStorage.write('shopline_user', updated);
    try{ const m=safeStorage.read('shopline_profiles')||{}; m[updated.email]=updated; safeStorage.write('shopline_profiles', m) }catch{};
    setUser(updated);
    setLoading(true);
    try{ await supabase.from('users').update({name:editName,phone:editPhone, bio:editBio}).eq('email', user.email) }catch{};
    setLoading(false);
    alert('Profile saved!');
    setShowProfile(false)
  }

  const startEdit = (product) => {
    setT(product.title); setD(product.desc); setP(product.price.toString().replace('K',''));
    setLoc(product.location); setNCountry(product.country); setNc(product.cat); setImg(product.image);
    setEditingProduct(product);
    setShowSell(true);
  }

  const deleteProduct = async (product) => {
    if(!confirm(`Delete ${product.title}?`)) return;
    setProducts(products.filter(pr => pr.id !== product.id));
    try{
      const { error } = await supabase.from('products').delete().eq('id', product.id);
      if(error) alert('Delete failed: '+error.message);
      else alert('Deleted!');
    }catch(e){ alert(e.message) }
  }

  const sell=async()=>{
    if(!t||!p) return alert('Add title & price');
    if(!user) return alert('Login first');
    setLoading(true);

    if(editingProduct){
      try{
        const updatedData = { title: t, name: t, description: d, price: p, location: loc, country: nCountry, category: nc, image_url: img, owner_email: user.email, seller_id: user.id };
        const { error } = await supabase.from('products').update(updatedData).eq('id', editingProduct.id);
        if(error) throw error;
        setProducts(products.map(pr => pr.id===editingProduct.id ? {...pr, title:t, desc:d, price:p.startsWith('K')?p:'K'+p, location:loc, country:nCountry, cat:nc, image:img, owner:user.email} : pr));
        alert('Updated!');
      }catch(e){ alert('Update failed: '+e.message) }
      setEditingProduct(null);
    } else {
      const np={id:Date.now(),title:t,desc:d,price:p.startsWith('K')?p:'K'+p,location:loc||editTown||'Global',country:nCountry||editCountry,cat:nc,image:img,owner:user?.email, seller_id: user?.id};
      setProducts([np,...products]);
      try{ 
        await supabase.from('products').insert([{ title: t, name: t, description: d, price: p, location: loc, country: nCountry, category: nc, image_url: img, owner_email: user?.email, seller_id: user?.id }]);
      }catch(e){ console.log(e) }
    }

    setLoading(false);
    setT(''); setD(''); setP(''); setLoc(''); setImg(''); setShowSell(false); setEditingProduct(null);
  }

  let filtered=cat==='All'?products:cat==='Trending'?products.slice(0,8):products.filter(x=>x.cat===cat)
  if(country!=='All Countries') filtered=filtered.filter(x=>x.country===country)
  if(search) filtered=filtered.filter(x=>x.title.toLowerCase().includes(search.toLowerCase()))
  const myAds=products.filter(pr=>pr.owner===user?.email)

  return (
    <div style={{minHeight:'100vh',background:'#f8fafc',fontFamily:'Arial'}}>
      <Header user={user} search={search} setSearch={setSearch} country={country} setCountry={setCountry} allCountriesFilter={allCountriesFilter} cat={cat} setCat={setCat} cats={cats} setShowSell={setShowSell} setShowProfile={setShowProfile} setShowLogin={setShowLogin} editCountry={editCountry} editPic={editPic} />
      <div style={{padding:'10px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',maxWidth:'700px',margin:'0 auto'}}>
        {filtered.map(pr=> <ProductCard key={pr.id} pr={pr} cats={cats} user={user} onEdit={startEdit} onDelete={deleteProduct} />)}
        {filtered.length===0 && <div style={{gridColumn:'span 2',textAlign:'center',padding:'30px',background:'#fff',borderRadius:'12px',color:'#888'}}>No products found in {country} - {cat}<br/>Be first to post!</div>}
      </div>
      {showProfile && <ProfileModal user={user} editName={editName} setEditName={setEditName} editBio={editBio} setEditBio={setEditBio} editCountry={editCountry} setEditCountry={setEditCountry} editTown={editTown} setEditTown={setEditTown} editPhone={editPhone} setEditPhone={setEditPhone} editPic={editPic} setEditPic={setEditPic} onSave={updateProfile} onClose={()=>setShowProfile(false)} myAds={myAds} loading={loading} />}
      {showLogin && <AuthModal contact={contact} setContact={setContact} pass={pass} setPass={setPass} showPass={showPass} setShowPass={setShowPass} onLogin={login} onClose={()=>setShowLogin(false)} loading={loading} />}
      {showVerify && <VerifyModal pendingUser={pendingUser} generatedCode={generatedCode} verifyInput={verifyInput} setVerifyInput={setVerifyInput} onConfirm={confirmVerify} onBack={()=>{setShowVerify(false);setShowLogin(true)}} loading={loading} />}
      {showSell && <SellModal t={t} setT={setT} d={d} setD={setD} p={p} setP={setP} loc={loc} setLoc={setLoc} nc={nc} setNc={setNc} nCountry={nCountry} setNCountry={setNCountry} img={img} setImg={setImg} cats={cats} countries={countries} onSell={sell} onClose={()=>{setShowSell(false);setEditingProduct(null)}} editingProduct={editingProduct} />}
    </div>
  )
                      }

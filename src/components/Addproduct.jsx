import {useState} from 'react'
import {supabase} from '../lib/supabase.js'
const C=['Phones','Clothes','Shoes','Bags','Beauty','Electronics','Home','Cars','Property','Jobs','Services','Food','Kids','Other']
export default function AddProduct({user,onAdded}){
const [name,setName]=useState(''),[price,setPrice]=useState(''),[img,setImg]=useState(''),[cat,setCat]=useState('Phones'),[phone,setPhone]=useState(''),[loc,setLoc]=useState('Lusaka')
async function submit(e){
e.preventDefault()
if(!user){alert('Login first');return}
let {error}=await supabase.from('products').insert([{name,price:Number(price),image_url:img,category:cat,seller_id:user.id,seller_name:user.email.split('@')[0],phone,location:loc}])
if(error)alert(error.message);else{setName('');setPrice('');setImg('');onAdded();alert('Product live! Everyone can see it now')}
}
return(<form onSubmit={submit} style={{background:'#fff',padding:12,borderRadius:12,display:'grid',gap:8}}>
<input value={name} onChange={e=>setName(e.target.value)} placeholder='What are you selling? e.g. iPhone 13' required style={{padding:10,borderRadius:8,border:'1px solid #ddd'}}/>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
<input value={price} onChange={e=>setPrice(e.target.value)} placeholder='Price ZMW' type='number' required style={{padding:10,borderRadius:8,border:'1px solid #ddd'}}/>
<select value={cat} onChange={e=>setCat(e.target.value)} style={{padding:10,borderRadius:8,border:'1px solid #ddd'}}>{C.map(c=><option key={c}>{c}</option>)}</select>
</div>
<input value={img} onChange={e=>setImg(e.target.value)} placeholder='Image URL - paste link from Google Images' required style={{padding:10,borderRadius:8,border:'1px solid #ddd'}}/>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
<input value={phone} onChange={e=>setPhone(e.target.value)} placeholder='Your WhatsApp e.g. 260970...' required style={{padding:10,borderRadius:8,border:'1px solid #ddd'}}/>
<input value={loc} onChange={e=>setLoc(e.target.value)} placeholder='Location e.g. Lusaka' style={{padding:10,borderRadius:8,border:'1px solid #ddd'}}/>
</div>
<button style={{background:'#16a34a',color:'#fff',padding:10,borderRadius:8,border:0,fontWeight:900}}>Publish to Market - Free</button>
<p style={{fontSize:10,color:'#666',textAlign:'center'}}>Buyers will contact you on WhatsApp instantly</p>
</form>)
         }

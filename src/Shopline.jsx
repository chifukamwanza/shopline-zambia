import React, { useState } from "react";

export default function Shopline() {
  const [page, setPage] = useState("home"); // home, country, post, listings, admin
  const [country, setCountry] = useState("Zambia");
  const [listings, setListings] = useState([]);
  const [adminLogin, setAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [form, setForm] = useState({title:"", price:"", desc:"", city:"Lusaka", photos:[], phone:""});

  const countries = [{name:"Zambia", flag:"🇿🇲"}, {name:"Kenya", flag:"🇰🇪"}, {name:"Nigeria", flag:"🇳🇬"}];
  const cities = ["Lusaka", "Ndola", "Kitwe", "Chipata", "Livingstone"];
  const ADMIN_PASSWORD = "admin123"; // Simple auth for demo

  const handlePost = () => {
    if (!form.title || !form.price || !form.desc || !form.phone) {
      alert("Please fill all fields");
      return;
    }
    const newListing = {...form, id: Date.now(), country};
    setListings([newListing, ...listings]);
    setForm({title:"", price:"", desc:"", city:"Lusaka", photos:[], phone:""});
    setPage("listings");
  }

  const handlePhotos = (e) => {
    const files = Array.from(e.target.files).slice(0,5);
    const urls = files.map(f => URL.createObjectURL(f));
    setForm({...form, photos: urls});
  }

  const handleDeleteListing = (id) => {
    setListings(listings.filter(l => l.id !== id));
  }

  const whatsappLink = (item) => 
    `https://wa.me/${item.phone}?text=Hi! I'm interested in your listing: ${item.title} on Shopline`;

  // HOME PAGE
  if(page === "home") return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-2">Shopline</h1>
        <p className="text-xl mb-8">Buy & Sell in Africa</p>
        <button onClick={()=>setPage("country")} className="bg-white text-green-600 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition text-lg">
          Enter Shopline
        </button>
      </div>
    </div>
  )

  // COUNTRY SELECTION PAGE
  if(page === "country") return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-6">Pick Your Country</h2>
        {countries.map(c=>(
          <div key={c.name} onClick={()=>{setCountry(c.name); setPage("listings")}} 
            className="p-4 border-2 border-gray-300 rounded-xl mb-3 cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
            <span className="text-2xl mr-3">{c.flag}</span>
            <span className="text-lg font-semibold">{c.name}</span>
          </div>
        ))}
        <button onClick={()=>setPage("post")} className="w-full mt-6 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition font-bold">
          + Post Listing
        </button>
        <button onClick={()=>setPage("admin")} className="w-full mt-2 bg-gray-700 text-white px-4 py-3 rounded-xl hover:bg-gray-800 transition font-bold">
          Admin Panel
        </button>
      </div>
    </div>
  )

  // POST LISTING PAGE
  if(page === "post") return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-lg mx-auto bg-white rounded-xl p-6 shadow-lg">
        <button onClick={()=>setPage("country")} className="text-blue-600 mb-4 font-semibold">← Back</button>
        <h2 className="text-2xl font-bold mb-6">Post in {country}</h2>
        
        <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="border-2 p-3 w-full my-3 rounded-lg focus:outline-none focus:border-green-500"/>
        
        <input placeholder="Price (USD)" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="border-2 p-3 w-full my-3 rounded-lg focus:outline-none focus:border-green-500"/>
        
        <select value={form.city} onChange={e=>setForm({...form,city:e.target.value})} className="border-2 p-3 w-full my-3 rounded-lg focus:outline-none focus:border-green-500">
          {cities.map(c=><option key={c}>{c}</option>)}
        </select>
        
        <textarea placeholder="Description" value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} className="border-2 p-3 w-full my-3 rounded-lg h-24 focus:outline-none focus:border-green-500 resize-none"/>
        
        <input placeholder="Your WhatsApp Number (e.g., +260123456789)" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="border-2 p-3 w-full my-3 rounded-lg focus:outline-none focus:border-green-500"/>
        
        <label className="block my-3">
          <input type="file" multiple accept="image/*" onChange={handlePhotos} className="block w-full text-sm text-gray-600 cursor-pointer"/>
          <p className="text-sm text-gray-500 mt-1">Add up to 5 photos</p>
        </label>
        
        {form.photos.length > 0 && (
          <div className="flex gap-2 my-4 flex-wrap">
            {form.photos.map((p,i)=><img key={i} src={p} className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"/>)}
          </div>
        )}
        
        <button onClick={handlePost} className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition mt-6">
          Post Listing
        </button>
      </div>
    </div>
  )

  // LISTINGS PAGE
  if(page === "listings") return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button onClick={()=>setPage("country")} className="text-blue-600 font-semibold">← Change Country</button>
          <h2 className="text-3xl font-bold">Listings in {country}</h2>
        </div>
        
        <button onClick={()=>setPage("post")} className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition mb-6">
          + Post New Listing
        </button>
        
        {listings.filter(l=>l.country===country).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No listings yet in {country}</p>
            <button onClick={()=>setPage("post")} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition">
              Be the first to post
            </button>
          </div>
        ) : (
          listings.filter(l=>l.country===country).map(item=>(
            <div key={item.id} className="bg-white border-2 border-gray-200 p-5 rounded-xl my-4 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-green-600 font-bold text-lg">${item.price}</p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-2">📍 {item.city}</p>
              <p className="text-gray-700 mb-4">{item.desc}</p>
              
              {item.photos.length > 0 && (
                <div className="flex gap-2 mb-4 overflow-x-auto">
                  {item.photos.map((photo, i) => (
                    <img key={i} src={photo} alt={`Photo ${i+1}`} className="w-24 h-24 object-cover rounded-lg flex-shrink-0 border border-gray-200"/>
                  ))}
                </div>
              )}
              
              <a href={whatsappLink(item)} target="_blank" rel="noopener noreferrer" className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 transition inline-block text-center">
                💬 Message on WhatsApp
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  )

  // ADMIN PAGE
  if(page === "admin") return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={()=>setPage("country")} className="text-blue-600 font-semibold mb-6">← Back</button>
        
        {!adminLogin ? (
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
            <input 
              type="password" 
              placeholder="Enter admin password" 
              value={adminPassword} 
              onChange={e=>setAdminPassword(e.target.value)} 
              className="border-2 p-3 w-full mb-4 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button 
              onClick={()=>{
                if(adminPassword === ADMIN_PASSWORD) {
                  setAdminLogin(true);
                  setAdminPassword("");
                } else {
                  alert("Wrong password");
                }
              }} 
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              <button onClick={()=>{setAdminLogin(false); setAdminPassword("")}} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition">
                Logout
              </button>
            </div>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-lg font-semibold">Total Listings: <span className="text-blue-600">{listings.length}</span></p>
              <p className="text-lg font-semibold mt-2">By Country:</p>
              {countries.map(c => (
                <p key={c.name} className="ml-4 text-gray-700">
                  {c.flag} {c.name}: <span className="font-bold">{listings.filter(l => l.country === c.name).length}</span>
                </p>
              ))}
            </div>
            
            <h3 className="text-xl font-bold mb-4">All Listings</h3>
            {listings.length === 0 ? (
              <p className="text-gray-500">No listings yet</p>
            ) : (
              listings.map(item => (
                <div key={item.id} className="border-2 border-gray-200 p-4 mb-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-bold text-lg">{item.title}</p>
                      <p className="text-gray-600">Country: {item.country} | City: {item.city}</p>
                      <p className="text-gray-600">Price: ${item.price}</p>
                      <p className="text-gray-600">Phone: {item.phone}</p>
                      <p className="text-gray-600">ID: {item.id}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteListing(item.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
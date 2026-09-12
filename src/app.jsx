import Dashboard from './pages/Dashboard'

function App() {
  const path = window.location.pathname

  if (path === '/dashboard') {
    return <Dashboard />
  }

  return (
    <div style={{padding: '40px', textAlign: 'center', fontFamily: 'Arial'}}>
      <h1>Welcome to Shopline Zambia</h1>
      <p>Marketplace for Zambian SMEs</p>
      <button 
        style={{background: '#27ae60', color: 'white', padding: '12px 24px', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer'}}
        onClick={() => window.location.href = '/dashboard'}
      >
        Go to Seller Dashboard
      </button>
    </div>
  )
}

export default App

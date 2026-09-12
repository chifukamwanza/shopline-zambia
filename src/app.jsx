import { useState } from 'react'
import Dashboard from './pages/Dashboard'

function App() {
  const [page, setPage] = useState(window.location.pathname)

  // Simple router
  if (page === '/dashboard') {
    return <Dashboard />
  }

  // Homepage
  return (
    <div style={{padding: '40px', textAlign: 'center'}}>
      <h1>Welcome to Shopline Zambia</h1>
      <button 
        className="btn btn-primary"
        onClick={() => window.location.href = '/dashboard'}
      >
        Go to Seller Dashboard
      </button>
    </div>
  )
}

export default App

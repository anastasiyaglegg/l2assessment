import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-20 bg-indigo-950 text-white shadow-lg shadow-indigo-950/10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-300 text-2xl shadow-md shadow-orange-300/20">
              <span aria-hidden="true">✦</span>
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-lg">Relay AI</div>
              <div className="text-xs text-indigo-200">Support, on autopilot</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1 rounded-2xl bg-white/5 p-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded ${
                isActive('/') 
                ? 'bg-orange-300 text-indigo-950 font-bold shadow-sm'
                : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/analyze"
              className={`px-4 py-2 rounded ${
                isActive('/analyze') 
                ? 'bg-orange-300 text-indigo-950 font-bold shadow-sm'
                : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Analyze
            </Link>
            <Link
              to="/history"
              className={`px-4 py-2 rounded ${
                isActive('/history') 
                ? 'bg-orange-300 text-indigo-950 font-bold shadow-sm'
                : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              History
            </Link>
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded ${
                isActive('/dashboard') 
                ? 'bg-orange-300 text-indigo-950 font-bold shadow-sm'
                : 'text-indigo-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

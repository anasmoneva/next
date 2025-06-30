import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Info, Grid3X3, FileText, Search, Settings, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, userRole, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary-600">
              E-LIFE SOCIETY
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link
                to="/"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              
              <Link
                to="/about"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/about') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <Info size={18} />
                <span>About Project</span>
              </Link>
              
              <Link
                to="/categories"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/categories') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <Grid3X3 size={18} />
                <span>Categories</span>
              </Link>
              
              <Link
                to="/check-status"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActive('/check-status') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                <Search size={18} />
                <span>Check Status</span>
              </Link>
              
              {userRole === 'super_admin' && (
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    location.pathname.startsWith('/admin') ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-primary-600'
                  }`}
                >
                  <Settings size={18} />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Welcome, Admin</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="btn-primary"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
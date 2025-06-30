import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Categories from './pages/Categories'
import Registration from './pages/Registration'
import CheckStatus from './pages/CheckStatus'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import RegistrationManagement from './pages/admin/RegistrationManagement'
import PanchayathManagement from './pages/admin/PanchayathManagement'
import CategoryManagement from './pages/admin/CategoryManagement'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/check-status" element={<CheckStatus />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="super_admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/registrations" element={
              <ProtectedRoute requiredRole="local_admin">
                <RegistrationManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/panchayaths" element={
              <ProtectedRoute requiredRole="local_admin">
                <PanchayathManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute requiredRole="local_admin">
                <CategoryManagement />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
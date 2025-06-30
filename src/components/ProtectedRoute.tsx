import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole: 'super_admin' | 'local_admin' | 'user_admin'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, userRole } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // Role hierarchy: super_admin > local_admin > user_admin
  const roleHierarchy = {
    'super_admin': 3,
    'local_admin': 2,
    'user_admin': 1
  }

  const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredRoleLevel = roleHierarchy[requiredRole]

  if (userRoleLevel < requiredRoleLevel) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
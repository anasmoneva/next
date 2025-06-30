import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isAuthenticated: boolean
  userRole: string | null
  username: string | null
  login: (username: string, role: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is already logged in
    const storedAuth = localStorage.getItem('adminAuth')
    if (storedAuth) {
      const { username: storedUsername, role } = JSON.parse(storedAuth)
      setIsAuthenticated(true)
      setUserRole(role)
      setUsername(storedUsername)
    }
  }, [])

  const login = (username: string, role: string) => {
    setIsAuthenticated(true)
    setUserRole(role)
    setUsername(username)
    localStorage.setItem('adminAuth', JSON.stringify({ username, role }))
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUserRole(null)
    setUsername(null)
    localStorage.removeItem('adminAuth')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
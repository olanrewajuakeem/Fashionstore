import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    const storedIsAdmin = localStorage.getItem('is_admin')
    if (token && storedUser) {
      setUser({ token, ...JSON.parse(storedUser) })
      setIsAdmin(storedIsAdmin === 'true')
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password })
      const { access_token, is_admin } = response.data
      const userData = { email }
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('is_admin', is_admin)
      setUser({ token: access_token, ...userData })
      setIsAdmin(is_admin)
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Login failed' }
    }
  }

  const signup = async (username, email, password) => {
    try {
      await axios.post('/api/signup', { username, email, password })
      return { success: true }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Signup failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('is_admin')
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)
import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (token && storedUser) {
      setUser({ token, ...JSON.parse(storedUser) })
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/login', { email, password })
      const { access_token, role } = response.data

      const userData = { email, role } 
      localStorage.setItem('token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))

      setUser({ token: access_token, ...userData })
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
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

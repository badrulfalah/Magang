import { useState, useEffect } from 'react'
import api from '../api/axios'
import AuthContext from './AuthContext'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const res = await api.get('/user')
      setUser(res.data.user)
      setPermissions(res.data.permissions || [])
    } catch {
      localStorage.removeItem('token')
      setUser(null)
      setPermissions([])
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
    setPermissions(res.data.permissions || [])
    return res.data
  }

  const logout = async () => {
    try { await api.post('/logout') } catch { /* ignore */ }
    localStorage.removeItem('token')
    setUser(null)
    setPermissions([])
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  const hasPermission = (perm) => permissions.includes(perm)

  const register = async (name, email, password, password_confirmation) => {
    const res = await api.post('/register', { name, email, password, password_confirmation })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
    setPermissions(res.data.permissions || [])
    return res.data
  }

  return (
    <AuthContext.Provider value={{ user, permissions, login, register, logout, loading, hasPermission, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

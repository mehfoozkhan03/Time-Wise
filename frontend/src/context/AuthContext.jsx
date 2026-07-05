import { createContext, useContext, useEffect, useState } from 'react'

import api from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get('/auth/me')

        setUser(res.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  async function login(email, password) {
    const res = await api.post('/auth/login', {
      email,
      password,
    })

    localStorage.setItem(
      'token',

      res.data.token,
    )

    setUser(res.data.user)
  }

  function logout() {
    localStorage.removeItem('token')

    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

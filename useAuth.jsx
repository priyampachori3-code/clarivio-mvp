import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken]       = useState(localStorage.getItem('cv_token'))
  const [firmName, setFirmName] = useState(localStorage.getItem('cv_firm') || '')

  function login(newToken, firm) {
    localStorage.setItem('cv_token', newToken)
    localStorage.setItem('cv_firm', firm)
    setToken(newToken)
    setFirmName(firm)
  }

  function logout() {
    localStorage.removeItem('cv_token')
    localStorage.removeItem('cv_firm')
    setToken(null)
    setFirmName('')
  }

  return (
    <AuthContext.Provider value={{ token, firmName, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

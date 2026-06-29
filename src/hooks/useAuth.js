import { useState, useCallback } from 'react'
import { login, register } from '../services/authService.js'
import { saveToken, saveUsername, removeToken, getToken, getUsername } from '../services/tokenService.js'

export function useAuth() {
  const [user, setUser] = useState(getUsername())
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const isLoggedIn = !!getToken()

  const handleLogin = useCallback(async (username, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await login(username, password)
      saveToken(response.token)
      saveUsername(response.username)
      setUser(response.username)
      return response
    } catch (err) {
      setError(err.message || 'Erro ao fazer login')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleRegister = useCallback(async (username, password) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await register(username, password)
      saveToken(response.token)
      saveUsername(response.username)
      setUser(response.username)
      return response
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleLogout = useCallback(() => {
    removeToken()
    setUser(null)
    window.location.href = '/login'
  }, [])

  return { user, isLoading, error, isLoggedIn, login: handleLogin, register: handleRegister, logout: handleLogout }
}

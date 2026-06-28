import { getToken, removeToken } from '../services/tokenService.js'

export function requestInterceptor(config) {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

export function responseInterceptor(response) {
  return response.data
}

export function errorInterceptor(error) {
  if (error.response?.status === 401) {
    removeToken()
    if (window.location.pathname !== '/login') {
      window.location.href = '/login'
    }
  }
  const normalized = {
    message: error.response?.data?.message || error.message || 'Erro de conexão',
    status: error.response?.status || 0,
  }
  return Promise.reject(normalized)
}

import apiClient from '../api/client.js'

export function login(username, password) {
  return apiClient.post('/api/v1/auth/login', { username, password })
}

export function register(username, password) {
  return apiClient.post('/api/v1/auth/register', { username, password })
}

import apiClient from '../api/client.js'

export function checkHealth() {
  return apiClient.get('/api/health')
}

import apiClient from '../api/client.js'

export function sendMessage(sessionId, text) {
  return apiClient.post('/api/chat', { sessionId, text })
}

export function getHistory(sessionId) {
  return apiClient.get(`/api/chat/${sessionId}`)
}

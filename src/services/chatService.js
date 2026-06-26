import apiClient from '../api/client.js'

export function createSession() {
  return apiClient.post('/api/v1/sessions')
}

export function sendMessage(sessionId, text) {
  return apiClient.post(`/api/v1/sessions/${sessionId}/messages`,{ content: text })
}

export function getHistory(sessionId) {
  return apiClient.get(`/api/v1/sessions/${sessionId}/messages`)
}

export function listSessions() {
  return apiClient.get('/api/v1/sessions')
}

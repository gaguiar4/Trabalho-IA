import apiClient from '../api/client.js'

export function createSession() {
  return apiClient.post('/api/v1/sessions')
}

export function sendMessage(sessionId, text) {
  return apiClient.post(`/api/v1/sessions/${sessionId}/messages`, { content: text })
}

export function getHistory(sessionId, page = 0, size = 20) {
  return apiClient.get(`/api/v1/sessions/${sessionId}/messages`, {
    params: { page, size },
  })
}

export function listSessions(page = 0, size = 20) {
  return apiClient.get('/api/v1/sessions', {
    params: { page, size },
  })
}

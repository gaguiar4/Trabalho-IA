import apiClient from '../api/client.js'

export function triggerIngestion(documentId) {
  return apiClient.post(`/api/v1/rag/ingest/${documentId}`)
}

export function getIngestionStatus(jobId) {
  return apiClient.get(`/api/v1/rag/ingest/${jobId}/status`)
}

export const ACCEPTED_FILE_TYPES = ['.txt', '.pdf']

export const MAX_FILE_SIZE = 10 * 1024 * 1024

export const HEALTH_POLL_INTERVAL = 30000

export const API_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  CHECKING: 'checking',
}

export const UPLOAD_STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
}

export const INGESTION_STATUS = {
  IDLE: 'IDLE',
  QUEUED: 'QUEUED',
  PARSING: 'PARSING',
  CHUNKING: 'CHUNKING',
  EMBEDDING: 'EMBEDDING',
  READY: 'READY',
  FAILED: 'FAILED',
}

export const INGESTION_POLL_INTERVAL = 3000

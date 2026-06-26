import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from './constants.js'

export function isValidFileType(file) {
  const extension = '.' + file.name.split('.').pop().toLowerCase()
  const mimeType = file.type.toLowerCase()
  return ACCEPTED_FILE_TYPES.includes(extension) || mimeType === 'text/plain' || mimeType === 'application/pdf'
}

export function isValidFileSize(file) {
  return file.size <= MAX_FILE_SIZE
}

export function isValidMessage(text) {
  return typeof text === 'string' && text.trim().length > 0
}

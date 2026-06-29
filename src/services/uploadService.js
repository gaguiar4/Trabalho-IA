import { getToken } from './tokenService.js'

export function uploadFile(file, onProgress, sessionId) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)
    if (sessionId != null) {
      formData.append('sessionId', sessionId)
    }

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress(percent)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          resolve(xhr.responseText)
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText)
          reject({ message: error.message || 'Erro no upload', status: xhr.status })
        } catch {
          reject({ message: 'Erro no upload', status: xhr.status })
        }
      }
    }

    xhr.onerror = () => {
      reject({ message: 'Erro de conexão', status: 0 })
    }

    xhr.open('POST', '/api/v1/documents/upload')
    const token = getToken()
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    xhr.send(formData)
  })
}

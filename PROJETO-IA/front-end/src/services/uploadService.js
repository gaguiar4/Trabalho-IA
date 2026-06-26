export function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)

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

    xhr.open('POST', `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/upload`)
    xhr.send(formData)
  })
}

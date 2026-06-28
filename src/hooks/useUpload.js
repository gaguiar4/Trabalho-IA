import { useState, useCallback } from 'react'
import { uploadFile } from '../services/uploadService.js'
import { triggerIngestion } from '../services/ingestionService.js'
import { isValidFileType, isValidFileSize } from '../utils/validators.js'
import { UPLOAD_STATUS } from '../utils/constants.js'

export function useUpload() {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState(UPLOAD_STATUS.IDLE)
  const [uploadError, setUploadError] = useState(null)
  const [documentId, setDocumentId] = useState(null)
  const [jobId, setJobId] = useState(null)

  const addFiles = useCallback((files) => {
    const validFiles = Array.from(files).filter((file) => {
      if (!isValidFileType(file)) return false
      if (!isValidFileSize(file)) return false
      return true
    })
    setSelectedFiles((prev) => [...prev, ...validFiles])
  }, [])

  const removeFile = useCallback((index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const startUpload = useCallback(async (sessionId) => {
    if (selectedFiles.length === 0) return

    setUploadStatus(UPLOAD_STATUS.UPLOADING)
    setUploadProgress(0)
    setUploadError(null)
    setDocumentId(null)
    setJobId(null)

    try {
      const file = selectedFiles[0]
      const uploadResponse = await uploadFile(file, (progress) => {
        setUploadProgress(progress)
      }, sessionId)

      setDocumentId(uploadResponse.id)

      setUploadStatus(UPLOAD_STATUS.SUCCESS)
      setUploadProgress(100)

      const ingestionResponse = await triggerIngestion(uploadResponse.id)
      setJobId(ingestionResponse.jobId)
    } catch (err) {
      setUploadStatus(UPLOAD_STATUS.ERROR)
      setUploadError(err.message || 'Erro no upload')
    }
  }, [selectedFiles])

  const resetUpload = useCallback(() => {
    setSelectedFiles([])
    setUploadProgress(0)
    setUploadStatus(UPLOAD_STATUS.IDLE)
    setUploadError(null)
    setDocumentId(null)
    setJobId(null)
  }, [])

  return { selectedFiles, uploadProgress, uploadStatus, uploadError, documentId, jobId, addFiles, removeFile, startUpload, resetUpload }
}

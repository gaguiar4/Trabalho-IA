import { useState, useEffect, useRef, useCallback } from 'react'
import { getIngestionStatus } from '../services/ingestionService.js'
import { INGESTION_STATUS, INGESTION_POLL_INTERVAL } from '../utils/constants.js'

export function useIngestionStatus(jobId) {
  const [status, setStatus] = useState(jobId ? INGESTION_STATUS.QUEUED : INGESTION_STATUS.IDLE)
  const [chunksCount, setChunksCount] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isPolling, setIsPolling] = useState(false)
  const intervalRef = useRef(null)

  const startPolling = useCallback(() => {
    if (!jobId) return
    setIsPolling(true)
    setStatus(INGESTION_STATUS.QUEUED)

    intervalRef.current = setInterval(async () => {
      try {
        const response = await getIngestionStatus(jobId)
        const currentStatus = response.status
        setStatus(currentStatus)
        setChunksCount(response.chunksCount ?? null)
        setErrorMessage(response.errorMessage ?? null)

        if (currentStatus === INGESTION_STATUS.READY || currentStatus === INGESTION_STATUS.FAILED) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setIsPolling(false)
        }
      } catch {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setIsPolling(false)
        setStatus(INGESTION_STATUS.FAILED)
        setErrorMessage('Erro ao verificar status da ingestão')
      }
    }, INGESTION_POLL_INTERVAL)
  }, [jobId])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPolling(false)
  }, [])

  useEffect(() => {
    if (jobId) {
      startPolling()
    }
    return () => stopPolling()
  }, [jobId])

  return { status, chunksCount, errorMessage, isPolling, stopPolling }
}

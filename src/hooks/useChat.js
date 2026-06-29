import { useState, useCallback } from 'react'
import { createSession, sendMessage, getHistory } from '../services/chatService.js'
import { uploadFile } from '../services/uploadService.js'
import { triggerIngestion, getIngestionStatus } from '../services/ingestionService.js'
import { isValidMessage } from '../utils/validators.js'
import { INGESTION_STATUS, INGESTION_POLL_INTERVAL } from '../utils/constants.js'

function parseMetadata(metadataStr) {
  if (!metadataStr) return null
  try {
    return JSON.parse(metadataStr)
  } catch {
    return null
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function useChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [currentSessionId, setCurrentSessionId] = useState(null)

  const send = useCallback(async (text, files = []) => {
    if (!text.trim() && files.length === 0) return
    if (text.trim() && !isValidMessage(text)) return

    let sessionId = currentSessionId

    try {
      if (!sessionId) {
        const sessionResponse = await createSession()
        sessionId = sessionResponse.id
        setCurrentSessionId(sessionId)
      }

      const attachments = []
      const documentIds = []

      if (files.length > 0) {
        setIsUploading(true)
        for (const file of files) {
          const uploadResponse = await uploadFile(file, null, sessionId)
          const ingestionResponse = await triggerIngestion(uploadResponse.id)
          attachments.push({ name: file.name, documentId: uploadResponse.id })
          documentIds.push({ documentId: uploadResponse.id, jobId: ingestionResponse.jobId })
        }

        for (const { jobId } of documentIds) {
          let status = INGESTION_STATUS.QUEUED
          while (status !== INGESTION_STATUS.READY && status !== INGESTION_STATUS.FAILED) {
            await sleep(INGESTION_POLL_INTERVAL)
            const statusResponse = await getIngestionStatus(jobId)
            status = statusResponse.status
          }
          if (status === INGESTION_STATUS.FAILED) {
            throw new Error(`Falha na ingestão do documento`)
          }
        }

        setIsUploading(false)
      }

      const messageText = text || (attachments.length > 0 ? '(arquivo anexado)' : '')

      const userMessage = {
        id: crypto.randomUUID(),
        text: messageText,
        sender: 'user',
        timestamp: new Date().toISOString(),
        attachments,
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      const response = await sendMessage(sessionId, messageText)
      const assistantMessage = {
        id: response.id || crypto.randomUUID(),
        text: response.content,
        sender: 'assistant',
        timestamp: response.createdAt || new Date().toISOString(),
        sources: parseMetadata(response.metadata),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setIsUploading(false)
      setError(err.message || 'Erro ao enviar mensagem')
    } finally {
      setIsLoading(false)
    }
  }, [currentSessionId])

  const loadSession = useCallback(async (sessionId) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getHistory(sessionId)
      setCurrentSessionId(sessionId)
      const mapped = (response.messages || []).map((msg) => ({
        id: msg.id,
        text: msg.content,
        sender: msg.role?.toLowerCase() === 'assistant' ? 'assistant' : 'user',
        timestamp: msg.createdAt || new Date().toISOString(),
        sources: msg.role?.toLowerCase() === 'assistant' ? parseMetadata(msg.metadata) : undefined,
      }))
      setMessages(mapped)
    } catch (err) {
      setError(err.message || 'Erro ao carregar histórico')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const createNewSession = useCallback(() => {
    setMessages([])
    setError(null)
    setCurrentSessionId(null)
  }, [])

  return {
    messages,
    isLoading,
    isUploading,
    error,
    currentSessionId,
    sendMessage: send,
    loadSession,
    clearMessages,
    createNewSession,
  }
}

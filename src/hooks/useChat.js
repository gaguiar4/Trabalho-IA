import { useState, useCallback } from 'react'
import { createSession, sendMessage, getHistory } from '../services/chatService.js'
import { isValidMessage } from '../utils/validators.js'

export function useChat() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentSessionId, setCurrentSessionId] = useState(null)

  const createNewSession = useCallback(() => {
    setMessages([])
    setError(null)
    setCurrentSessionId(null)
  }, [])

  const send = useCallback(async (text) => {
    if (!isValidMessage(text)) return

    let sessionId = currentSessionId

    try {
      if (!sessionId) {
        const sessionResponse = await createSession()
        sessionId = sessionResponse.id
        setCurrentSessionId(sessionId)
      }

      const userMessage = {
        id: crypto.randomUUID(),
        text,
        sender: 'user',
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      const response = await sendMessage(sessionId, text)
      const assistantMessage = {
        id: crypto.randomUUID(),
        text: response.content,
        sender: 'assistant',
        timestamp: response.createdAt || new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
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

  return {
    messages,
    isLoading,
    error,
    currentSessionId,
    sendMessage: send,
    loadSession,
    clearMessages,
    createNewSession,
  }
}

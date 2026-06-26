import { useState, useCallback } from 'react'
import { sendMessage, getHistory } from '../services/chatService.js'
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

    if (!currentSessionId) {
      setCurrentSessionId(crypto.randomUUID())
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

    try {
      const response = await sendMessage(currentSessionId, text)
      const assistantMessage = {
        id: crypto.randomUUID(),
        text: response.message.text,
        sender: 'assistant',
        timestamp: response.message.timestamp || new Date().toISOString(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      if (response.sessionId) {
        setCurrentSessionId(response.sessionId)
      }
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
      setMessages(response.messages || [])
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

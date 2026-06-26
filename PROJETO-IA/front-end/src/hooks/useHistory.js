import { useState, useCallback } from 'react'
import { getHistory } from '../services/chatService.js'

export function useHistory() {
  const [sessions, setSessions] = useState([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [errorSessions, setErrorSessions] = useState(null)

  const fetchSessions = useCallback(async () => {
    setIsLoadingSessions(true)
    setErrorSessions(null)
    try {
      const response = await getHistory('')
      setSessions(response.sessions || [])
    } catch (err) {
      setErrorSessions(err.message || 'Erro ao carregar sessões')
    } finally {
      setIsLoadingSessions(false)
    }
  }, [])

  const selectSession = useCallback((sessionId) => {
    return sessionId
  }, [])

  return { sessions, isLoadingSessions, errorSessions, fetchSessions, selectSession }
}

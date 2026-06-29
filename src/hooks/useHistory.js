import { useState, useCallback } from 'react'
import { listSessions } from '../services/chatService.js'

export function useHistory() {
  const [sessions, setSessions] = useState([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [errorSessions, setErrorSessions] = useState(null)
  const [page, setPage] = useState(0)
  const [hasNext, setHasNext] = useState(false)

  const fetchSessions = useCallback(async (pageNum = 0) => {
    setIsLoadingSessions(true)
    setErrorSessions(null)
    try {
      const response = await listSessions(pageNum)
      const list = response.sessions || response || []
      if (pageNum === 0) {
        setSessions(list)
      } else {
        setSessions((prev) => [...prev, ...list])
      }
      setPage(pageNum)
      setHasNext(response.hasNext ?? false)
    } catch (err) {
      setErrorSessions(err.message || 'Erro ao carregar sessões')
    } finally {
      setIsLoadingSessions(false)
    }
  }, [])

  const loadMore = useCallback(() => {
    if (!hasNext || isLoadingSessions) return
    fetchSessions(page + 1)
  }, [hasNext, isLoadingSessions, page, fetchSessions])

  const selectSession = useCallback((sessionId) => {
    return sessionId
  }, [])

  return { sessions, isLoadingSessions, errorSessions, hasNext, fetchSessions, loadMore, selectSession }
}

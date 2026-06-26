import { useState, useEffect, useRef, useCallback } from 'react'
import { checkHealth } from '../services/healthService.js'
import { API_STATUS, HEALTH_POLL_INTERVAL } from '../utils/constants.js'

export function useHealthCheck() {
  const [apiStatus, setApiStatus] = useState(API_STATUS.CHECKING)
  const [lastCheck, setLastCheck] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const intervalRef = useRef(null)

  const check = useCallback(async () => {
    setIsChecking(true)
    setApiStatus(API_STATUS.CHECKING)
    try {
      await checkHealth()
      setApiStatus(API_STATUS.ONLINE)
      setLastCheck(new Date())
    } catch {
      setApiStatus(API_STATUS.OFFLINE)
    } finally {
      setIsChecking(false)
    }
  }, [])

  const startPolling = useCallback((intervalMs = HEALTH_POLL_INTERVAL) => {
    stopPolling()
    check()
    intervalRef.current = setInterval(check, intervalMs)
  }, [check])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopPolling()
  }, [stopPolling])

  return { apiStatus, lastCheck, isChecking, checkHealth: check, startPolling, stopPolling }
}

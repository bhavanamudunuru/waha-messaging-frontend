import { useEffect, useState } from 'react'
import { fetchSessionStatus } from '../services/api'
import { SessionStatus } from '../types'

const POLL_INTERVAL_MS = 15000

export function useSessionStatus() {
  const [session, setSession] = useState<SessionStatus>({ connected: false, status: 'CHECKING' })

  useEffect(() => {
    let cancelled = false

    async function checkStatus() {
      const status = await fetchSessionStatus()
      if (!cancelled) setSession(status)
    }

    checkStatus()
    const interval = setInterval(checkStatus, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return session
}

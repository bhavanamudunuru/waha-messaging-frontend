import { useEffect, useState, useCallback } from 'react'
import { ScrollText, RefreshCw, Trash2, User, Users, CheckCircle2, XCircle } from 'lucide-react'
import { fetchLogs, clearLogs } from '../services/api'
import { LogEntry } from '../types'

export default function LogsPanel({ refreshSignal }: { refreshSignal: number }) {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(false)

  const loadLogs = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchLogs(50)
      setLogs(data)
    } catch {
      // silently ignore — backend might not be reachable yet
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadLogs()
  }, [loadLogs, refreshSignal])

  async function handleClear() {
    if (!window.confirm('Clear all message logs? This cannot be undone.')) return
    await clearLogs()
    loadLogs()
  }

  function formatTime(iso: string) {
    const d = new Date(iso)
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      style={{
        background: 'var(--color-panel)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ScrollText size={18} color="var(--color-forest-deep)" />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: 'var(--color-ink)' }}>
            Message logs
          </h2>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              padding: '3px 9px',
              borderRadius: 999,
              background: 'var(--color-forest-soft)',
              color: 'var(--color-forest-deep)',
              fontWeight: 600,
            }}
          >
            {logs.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={loadLogs}
            title="Refresh logs"
            style={{ padding: 8, borderRadius: 8, color: 'var(--color-ink-soft)', display: 'flex' }}
          >
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
          </button>
          <button
            onClick={handleClear}
            title="Clear logs"
            style={{ padding: 8, borderRadius: 8, color: 'var(--color-coral-deep)', display: 'flex' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div style={{ maxHeight: 420, overflowY: 'auto' }}>
        {logs.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-ink-faint)', fontSize: 13.5 }}>
              No messages sent yet. Your sending history will appear here.
            </p>
          </div>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 14,
                padding: '14px 24px',
                borderBottom: i < logs.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  background: log.receiver_type === 'group' ? 'var(--color-amber-soft)' : 'var(--color-forest-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {log.receiver_type === 'group' ? (
                  <Users size={15} color="var(--color-amber)" />
                ) : (
                  <User size={15} color="var(--color-forest)" />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: 'var(--color-ink)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {log.receiver_id}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--color-ink-faint)', flexShrink: 0 }}>
                    {formatTime(log.timestamp)}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: 'var(--color-ink-soft)',
                    marginTop: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {log.message}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  {log.status === 'success' ? (
                    <>
                      <CheckCircle2 size={13} color="var(--color-forest)" />
                      <span style={{ fontSize: 11.5, color: 'var(--color-forest-deep)', fontWeight: 600 }}>Success</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={13} color="var(--color-coral-deep)" />
                      <span style={{ fontSize: 11.5, color: 'var(--color-coral-deep)', fontWeight: 600 }}>
                        Failed{log.error ? ` — ${log.error.slice(0, 60)}` : ''}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

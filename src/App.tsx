import { useState, useEffect } from 'react'
import { MessageCircle, User, Users, Clock, ShieldCheck } from 'lucide-react'
import StatusBadge from './components/StatusBadge'
import PhonePreview from './components/PhonePreview'
import MessageForm from './components/MessageForm'
import LogsPanel from './components/LogsPanel'
import { fetchSessionStatus, SessionStatus } from './services/api'

type Mode = 'individual' | 'group' | 'scheduled'

const API_BASE = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'

export default function App() {
  const [mode, setMode] = useState<Mode>('individual')
  const [previewMessage, setPreviewMessage] = useState('')
  const [previewReceiver, setPreviewReceiver] = useState('')
  const [refreshSignal, setRefreshSignal] = useState(0)
  const [session, setSession] = useState<SessionStatus>({ connected: false, status: 'CHECKING' })

  // Scheduled form state
  const [schedReceiverId, setSchedReceiverId] = useState('')
  const [schedReceiverType, setSchedReceiverType] = useState<'individual' | 'group'>('individual')
  const [schedMessage, setSchedMessage] = useState('')
  const [schedTime, setSchedTime] = useState('')
  const [schedStatus, setSchedStatus] = useState<string | null>(null)
  const [schedLoading, setSchedLoading] = useState(false)

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 15000)
    return () => clearInterval(interval)
  }, [])

  async function checkStatus() {
    const status = await fetchSessionStatus()
    setSession(status)
  }

  function handleModeChange(newMode: Mode) {
    setMode(newMode)
    setPreviewMessage('')
    setPreviewReceiver('')
    setSchedStatus(null)
  }

  async function handleScheduleSubmit() {
    if (!schedReceiverId || !schedMessage || !schedTime) {
      setSchedStatus('error:Please fill in all fields.')
      return
    }
    setSchedLoading(true)
    setSchedStatus(null)
    try {
      const res = await fetch(`${API_BASE}/api/send/scheduled`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiver_type: schedReceiverType,
          receiver_id: schedReceiverId,
          message: schedMessage,
          scheduled_time: schedTime,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to schedule')
      setSchedStatus(`success:Message scheduled! Will be sent in ${data.delay_seconds} seconds.`)
      setSchedReceiverId('')
      setSchedMessage('')
      setSchedTime('')
      setTimeout(() => setRefreshSignal(s => s + 1), 1000)
    } catch (e: any) {
      setSchedStatus(`error:${e.message}`)
    } finally {
      setSchedLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      {/* Top bar */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '22px 40px',
          borderBottom: '1px solid var(--color-border)',
          background: 'rgba(250, 247, 240, 0.85)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 11,
              background: 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageCircle size={20} color="white" strokeWidth={2.2} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: 'var(--color-ink)', lineHeight: 1.1 }}>
              Vaha Messenger
            </h1>
            <p style={{ fontSize: 11.5, color: 'var(--color-ink-faint)', fontFamily: 'var(--font-mono)' }}>
              Admin messaging console
            </p>
          </div>
        </div>
        <StatusBadge connected={session.connected} status={session.status} />
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 40px 0' }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-forest)', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 600 }}>
            WHATSAPP HTTP API · POWERED BY WAHA
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, color: 'var(--color-ink)', maxWidth: 600, lineHeight: 1.2 }}>
            Send messages to numbers and groups, instantly.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>
          {/* Left panel */}
          <div
            style={{
              background: 'var(--color-panel)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
            }}
          >
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
              <TabButton active={mode === 'individual'} onClick={() => handleModeChange('individual')} icon={<User size={15} />} label="Individual number" />
              <TabButton active={mode === 'group'} onClick={() => handleModeChange('group')} icon={<Users size={15} />} label="WhatsApp group" />
              <TabButton active={mode === 'scheduled'} onClick={() => handleModeChange('scheduled')} icon={<Clock size={15} />} label="Schedule" />
            </div>

            <div style={{ padding: 28 }}>
              {mode === 'scheduled' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {/* Receiver type toggle */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', display: 'block', marginBottom: 8 }}>
                      Send to
                    </label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {(['individual', 'group'] as const).map(t => (
                        <button
                          key={t}
                          onClick={() => setSchedReceiverType(t)}
                          style={{
                            padding: '8px 18px',
                            borderRadius: 8,
                            border: '1.5px solid',
                            borderColor: schedReceiverType === t ? 'var(--color-forest)' : 'var(--color-border)',
                            background: schedReceiverType === t ? 'var(--color-forest-soft)' : 'transparent',
                            color: schedReceiverType === t ? 'var(--color-forest-deep)' : 'var(--color-ink-faint)',
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          {t === 'individual' ? 'Individual' : 'Group'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Receiver ID */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', display: 'block', marginBottom: 8 }}>
                      {schedReceiverType === 'individual' ? 'Phone number' : 'Group ID (numeric-id@g.us)'}
                    </label>
                    <input
                      value={schedReceiverId}
                      onChange={e => setSchedReceiverId(e.target.value)}
                      placeholder={schedReceiverType === 'individual' ? '9876543210' : '120363389200002815@g.us'}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1.5px solid var(--color-border)',
                        fontSize: 14,
                        fontFamily: 'var(--font-mono)',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', display: 'block', marginBottom: 8 }}>
                      Message
                    </label>
                    <textarea
                      value={schedMessage}
                      onChange={e => { setSchedMessage(e.target.value); setPreviewMessage(e.target.value) }}
                      placeholder="Type your scheduled message here..."
                      rows={4}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1.5px solid var(--color-border)',
                        fontSize: 14,
                        resize: 'vertical',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                      }}
                    />
                  </div>

                  {/* Schedule time */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)', display: 'block', marginBottom: 8 }}>
                      Schedule date & time
                    </label>
                    <input
                      type="datetime-local"
                      value={schedTime}
                      onChange={e => setSchedTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1.5px solid var(--color-border)',
                        fontSize: 14,
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Status message */}
                  {schedStatus && (
                    <div
                      style={{
                        padding: '10px 14px',
                        borderRadius: 8,
                        background: schedStatus.startsWith('success') ? '#f0fdf4' : '#fef2f2',
                        border: `1px solid ${schedStatus.startsWith('success') ? '#bbf7d0' : '#fecaca'}`,
                        color: schedStatus.startsWith('success') ? '#166534' : '#991b1b',
                        fontSize: 13,
                        fontWeight: 500,
                      }}
                    >
                      {schedStatus.split(':').slice(1).join(':')}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    onClick={handleScheduleSubmit}
                    disabled={schedLoading}
                    style={{
                      padding: '12px 24px',
                      borderRadius: 8,
                      background: 'var(--color-forest)',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 14,
                      border: 'none',
                      cursor: schedLoading ? 'not-allowed' : 'pointer',
                      opacity: schedLoading ? 0.7 : 1,
                    }}
                  >
                    {schedLoading ? 'Scheduling...' : 'Schedule message'}
                  </button>
                </div>
              ) : (
                <MessageForm
                  mode={mode}
                  onMessageChange={setPreviewMessage}
                  onReceiverChange={setPreviewReceiver}
                  onSent={() => setRefreshSignal((s) => s + 1)}
                />
              )}
            </div>
          </div>

          {/* Right: preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'sticky', top: 100 }}>
            <PhonePreview
              receiverLabel={mode === 'scheduled' ? schedReceiverId || 'Recipient' : previewReceiver}
              message={mode === 'scheduled' ? schedMessage : previewMessage}
              isGroup={mode === 'group' || schedReceiverType === 'group'}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '8px 14px',
                borderRadius: 999,
                background: 'var(--color-amber-soft)',
                border: '1px solid var(--color-amber)',
              }}
            >
              <ShieldCheck size={13} color="#A06B00" />
              <span style={{ fontSize: 11, color: '#A06B00', fontWeight: 600 }}>Test numbers/groups only</span>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div style={{ marginTop: 36 }}>
          <LogsPanel refreshSignal={refreshSignal} />
        </div>
      </main>

      <style>{`
        .spin { animation: spin 0.9s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '16px 20px',
        fontSize: 13.5,
        fontWeight: 600,
        fontFamily: 'var(--font-display)',
        color: active ? 'var(--color-forest-deep)' : 'var(--color-ink-faint)',
        background: active ? 'var(--color-forest-soft)' : 'transparent',
        borderBottom: active ? '2.5px solid var(--color-forest)' : '2.5px solid transparent',
        transition: 'all 0.15s ease',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
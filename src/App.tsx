import { useState, useEffect } from 'react'
import { MessageCircle, User, Users, ShieldCheck } from 'lucide-react'
import StatusBadge from './components/StatusBadge'
import PhonePreview from './components/PhonePreview'
import MessageForm from './components/MessageForm'
import LogsPanel from './components/LogsPanel'
import { fetchSessionStatus, SessionStatus } from './services/api'

type Mode = 'individual' | 'group'

export default function App() {
  const [mode, setMode] = useState<Mode>('individual')
  const [previewMessage, setPreviewMessage] = useState('')
  const [previewReceiver, setPreviewReceiver] = useState('')
  const [refreshSignal, setRefreshSignal] = useState(0)
  const [session, setSession] = useState<SessionStatus>({ connected: false, status: 'CHECKING' })

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
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      {/* ── Top bar ────────────────────────────────────────── */}
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

      {/* ── Main content ───────────────────────────────────── */}
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 40px 0' }}>
        {/* Intro */}
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--color-forest)', letterSpacing: '0.06em', marginBottom: 8, fontWeight: 600 }}>
            WHATSAPP HTTP API · POWERED BY WAHA
          </p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, color: 'var(--color-ink)', maxWidth: 600, lineHeight: 1.2 }}>
            Send messages to numbers and groups, instantly.
          </h2>
        </div>

        {/* Two column layout: form + preview */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28, alignItems: 'start' }}>
          {/* Left: Control panel */}
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
              <TabButton
                active={mode === 'individual'}
                onClick={() => handleModeChange('individual')}
                icon={<User size={15} />}
                label="Individual number"
              />
              <TabButton
                active={mode === 'group'}
                onClick={() => handleModeChange('group')}
                icon={<Users size={15} />}
                label="WhatsApp group"
              />
            </div>

            <div style={{ padding: 28 }}>
              <MessageForm
                mode={mode}
                onMessageChange={setPreviewMessage}
                onReceiverChange={setPreviewReceiver}
                onSent={() => setRefreshSignal((s) => s + 1)}
              />
            </div>
          </div>

          {/* Right: Live preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'sticky', top: 100 }}>
            <PhonePreview receiverLabel={previewReceiver} message={previewMessage} isGroup={mode === 'group'} />
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
        .spin {
          animation: spin 0.9s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
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
      }}
    >
      {icon}
      {label}
    </button>
  )
}

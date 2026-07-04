import { useState } from 'react'
import { User, Users, ShieldCheck, Clock } from 'lucide-react'
import Header from './components/Header'
import TabButton from './components/TabButton'
import PhonePreview from './components/PhonePreview'
import MessageForm from './components/MessageForm'
import LogsPanel from './components/LogsPanel'
import { useSessionStatus } from './hooks/useSessionStatus'
import { Mode } from './types'

export default function App() {
  const [mode, setMode] = useState<Mode>('individual')
  const [previewMessage, setPreviewMessage] = useState('')
  const [previewReceiver, setPreviewReceiver] = useState('')
  const [refreshSignal, setRefreshSignal] = useState(0)
  const session = useSessionStatus()

  function handleModeChange(newMode: Mode) {
    setMode(newMode)
    setPreviewMessage('')
    setPreviewReceiver('')
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      <Header session={session} />

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
              <TabButton
                active={mode === 'schedule'}
                onClick={() => handleModeChange('schedule')}
                icon={<Clock size={15} />}
                label="Schedule"
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
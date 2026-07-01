import { Check, CheckCheck } from 'lucide-react'

interface Props {
  receiverLabel: string
  message: string
  isGroup: boolean
}

export default function PhonePreview({ receiverLabel, message, isGroup }: Props) {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #1A2421 0%, #0F1714 100%)',
        borderRadius: 36,
        padding: 14,
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: 320,
      }}
    >
      <div
        style={{
          background: 'var(--color-chat-bg)',
          borderRadius: 24,
          overflow: 'hidden',
          minHeight: 420,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'var(--color-forest-deep)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: isGroup ? 'var(--color-amber)' : 'var(--color-coral)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 14,
              color: 'white',
              flexShrink: 0,
            }}
          >
            {isGroup ? 'G' : receiverLabel.replace(/\D/g, '').slice(-2) || '?'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ color: 'white', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-display)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {receiverLabel || (isGroup ? 'WhatsApp Group' : 'Recipient')}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
              {isGroup ? 'Group chat' : 'Online'}
            </p>
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, padding: '20px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 8 }}>
          {message ? (
            <div
              style={{
                alignSelf: 'flex-end',
                maxWidth: '82%',
                background: 'var(--color-bubble-out)',
                borderRadius: '12px 12px 2px 12px',
                padding: '8px 10px',
                boxShadow: '0 1px 1px var(--color-bubble-shadow)',
              }}
            >
              <p style={{ fontSize: 13.5, color: '#1A2421', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.4 }}>
                {message}
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <span style={{ fontSize: 10, color: 'rgba(26,36,33,0.45)' }}>{timeStr}</span>
                <CheckCheck size={14} color="#53BDEB" />
              </div>
            </div>
          ) : (
            <div
              style={{
                alignSelf: 'center',
                color: 'var(--color-ink-faint)',
                fontSize: 12,
                textAlign: 'center',
                padding: '0 20px',
              }}
            >
              Start typing — your message will preview here exactly as it will appear on WhatsApp.
            </div>
          )}
        </div>

        {/* Fake input bar */}
        <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, background: 'white', borderRadius: 999, padding: '8px 14px' }}>
            <span style={{ fontSize: 12, color: 'var(--color-ink-faint)' }}>Message</span>
          </div>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--color-forest)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Check size={15} color="white" />
          </div>
        </div>
      </div>
    </div>
  )
}

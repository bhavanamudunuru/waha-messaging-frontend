import { MessageCircle } from 'lucide-react'
import StatusBadge from './StatusBadge'
import { SessionStatus } from '../types'

interface Props {
  session: SessionStatus
}

export default function Header({ session }: Props) {
  return (
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
  )
}

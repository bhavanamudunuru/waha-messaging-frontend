import { Radio } from 'lucide-react'

interface Props {
  connected: boolean
  status: string
}

export default function StatusBadge({ connected, status }: Props) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderRadius: 999,
        background: connected ? 'var(--color-forest-soft)' : 'var(--color-coral-soft)',
        border: `1px solid ${connected ? 'var(--color-forest)' : 'var(--color-coral)'}`,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: connected ? 'var(--color-forest)' : 'var(--color-coral)',
          boxShadow: connected ? '0 0 0 4px rgba(11,110,79,0.15)' : '0 0 0 4px rgba(255,107,92,0.15)',
        }}
      />
      <Radio size={13} color={connected ? 'var(--color-forest-deep)' : 'var(--color-coral-deep)'} />
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 500,
          color: connected ? 'var(--color-forest-deep)' : 'var(--color-coral-deep)',
          letterSpacing: '0.02em',
        }}
      >
        {connected ? 'WAHA SESSION CONNECTED' : `WAHA ${status}`}
      </span>
    </div>
  )
}

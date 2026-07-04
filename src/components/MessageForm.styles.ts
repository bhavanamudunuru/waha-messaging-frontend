import { CSSProperties } from 'react'

export const labelStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12.5,
  fontWeight: 600,
  color: 'var(--color-ink-soft)',
  marginBottom: 7,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
}

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1.5px solid var(--color-border)',
  background: 'var(--color-bg-elevated)',
  fontSize: 14,
  color: 'var(--color-ink)',
  outline: 'none',
}

export const hintStyle: CSSProperties = {
  fontSize: 11.5,
  color: 'var(--color-ink-faint)',
  marginTop: 6,
  fontFamily: 'var(--font-mono)',
}

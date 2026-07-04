interface Props {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}

export default function TabButton({ active, onClick, icon, label }: Props) {
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

import { User, Users, Clock } from 'lucide-react'
import { labelStyle, inputStyle } from './MessageForm.styles'

interface Props {
  scheduleReceiverType: 'individual' | 'group'
  setScheduleReceiverType: (val: 'individual' | 'group') => void
  scheduleReceiverId: string
  setScheduleReceiverId: (val: string) => void
  countryCode: string
  setCountryCode: (val: string) => void
  scheduledTime: string
  setScheduledTime: (val: string) => void
  onReceiverChange: (label: string) => void
}

export default function ScheduleFields({
  scheduleReceiverType,
  setScheduleReceiverType,
  scheduleReceiverId,
  setScheduleReceiverId,
  countryCode,
  setCountryCode,
  scheduledTime,
  setScheduledTime,
  onReceiverChange,
}: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <label style={labelStyle}>Send to</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setScheduleReceiverType('individual')}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${scheduleReceiverType === 'individual' ? 'var(--color-forest)' : 'var(--color-border)'}`,
              background: scheduleReceiverType === 'individual' ? 'var(--color-forest-soft)' : 'transparent',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => setScheduleReceiverType('group')}
            style={{
              flex: 1,
              padding: '9px 12px',
              borderRadius: 'var(--radius-sm)',
              border: `1px solid ${scheduleReceiverType === 'group' ? 'var(--color-forest)' : 'var(--color-border)'}`,
              background: scheduleReceiverType === 'group' ? 'var(--color-forest-soft)' : 'transparent',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Group
          </button>
        </div>
      </div>

      <div>
        <label style={labelStyle}>
          {scheduleReceiverType === 'individual' ? <User size={14} /> : <Users size={14} />}
          {scheduleReceiverType === 'individual' ? ' Phone number' : ' WhatsApp Group ID'}
        </label>
        {scheduleReceiverType === 'individual' ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.replace(/\D/g, ''))}
              placeholder="91"
              style={{ ...inputStyle, width: 64, textAlign: 'center', fontFamily: 'var(--font-mono)' }}
              maxLength={3}
            />
            <input
              value={scheduleReceiverId}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '')
                setScheduleReceiverId(val)
                onReceiverChange(val ? `+${countryCode} ${val}` : '')
              }}
              placeholder="9876543210"
              style={{ ...inputStyle, flex: 1 }}
              maxLength={15}
            />
          </div>
        ) : (
          <input
            value={scheduleReceiverId}
            onChange={(e) => {
              setScheduleReceiverId(e.target.value)
              onReceiverChange(e.target.value)
            }}
            placeholder="120363426488518199@g.us"
            style={inputStyle}
          />
        )}
      </div>

      <div>
        <label style={labelStyle}>
          <Clock size={14} /> Schedule date & time
        </label>
        <input
          type="datetime-local"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          style={inputStyle}
        />
      </div>
    </div>
  )
}
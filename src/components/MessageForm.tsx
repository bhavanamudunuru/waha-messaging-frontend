import { useState, FormEvent } from 'react'
import { Send, User, Users, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { sendIndividualMessage, sendGroupMessage, sendScheduledMessage } from '../services/api'
import { Mode } from '../types'
import { labelStyle, inputStyle, hintStyle } from './MessageForm.styles'
import ScheduleFields from './ScheduleFields'

interface Props {
  mode: Mode
  onMessageChange: (msg: string) => void
  onReceiverChange: (label: string) => void
  onSent: () => void
}

export default function MessageForm({ mode, onMessageChange, onReceiverChange, onSent }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('91')
  const [groupId, setGroupId] = useState('')
  const [scheduleReceiverType, setScheduleReceiverType] = useState<'individual' | 'group'>('individual')
  const [scheduleReceiverId, setScheduleReceiverId] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleMessageInput = (val: string) => {
    setMessage(val)
    onMessageChange(val)
  }

  const handlePhoneInput = (val: string) => {
    setPhoneNumber(val)
    onReceiverChange(val ? `+${countryCode} ${val}` : '')
  }

  const handleGroupInput = (val: string) => {
    setGroupId(val)
    onReceiverChange(val)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setFeedback(null)

    if (!message.trim()) {
      setFeedback({ type: 'error', text: 'Message cannot be empty.' })
      return
    }
    if (mode === 'individual' && phoneNumber.replace(/\D/g, '').length < 7) {
      setFeedback({ type: 'error', text: 'Enter a valid phone number.' })
      return
    }
    if (mode === 'group' && !groupId.trim()) {
      setFeedback({ type: 'error', text: 'Enter a WhatsApp group ID.' })
      return
    }
    if (mode === 'schedule' && !scheduleReceiverId.trim()) {
      setFeedback({ type: 'error', text: 'Enter a recipient.' })
      return
    }
    if (mode === 'schedule' && !scheduledTime) {
      setFeedback({ type: 'error', text: 'Pick a date & time to schedule.' })
      return
    }

    setSending(true)
    try {
      if (mode === 'individual') {
        await sendIndividualMessage({ phone_number: phoneNumber, message, country_code: countryCode })
      } else if (mode === 'group') {
        await sendGroupMessage({ group_id: groupId, message })
      } else {
        const result = await sendScheduledMessage({
          receiver_type: scheduleReceiverType,
          receiver_id: scheduleReceiverId,
          message,
          scheduled_time: scheduledTime,
          country_code: scheduleReceiverType === 'individual' ? countryCode : undefined,
        })
        setFeedback({ type: 'success', text: `Message scheduled! Will be sent in ${result.delay_seconds} seconds.` })
        handleMessageInput('')
        onSent()
        setSending(false)
        return
      }
      setFeedback({ type: 'success', text: 'Message sent successfully.' })
      handleMessageInput('')
      onSent()
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message || 'Failed to send message.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {mode === 'schedule' ? (
        <ScheduleFields
          scheduleReceiverType={scheduleReceiverType}
          setScheduleReceiverType={setScheduleReceiverType}
          scheduleReceiverId={scheduleReceiverId}
          setScheduleReceiverId={setScheduleReceiverId}
          countryCode={countryCode}
          setCountryCode={setCountryCode}
          scheduledTime={scheduledTime}
          setScheduledTime={setScheduledTime}
          onReceiverChange={onReceiverChange}
        />
      ) : mode === 'individual' ? (
        <div>
          <label style={labelStyle}>
            <User size={14} /> Phone number
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value.replace(/\D/g, ''))}
              placeholder="91"
              style={{ ...inputStyle, width: 64, textAlign: 'center', fontFamily: 'var(--font-mono)' }}
              maxLength={3}
            />
            <input
              value={phoneNumber}
              onChange={(e) => handlePhoneInput(e.target.value.replace(/\D/g, ''))}
              placeholder="9876543210"
              style={{ ...inputStyle, flex: 1 }}
              maxLength={15}
            />
          </div>
          <p style={hintStyle}>Will be sent as: {phoneNumber ? `${countryCode}${phoneNumber}@c.us` : 'countrycode + number + @c.us'}</p>
        </div>
      ) : (
        <div>
          <label style={labelStyle}>
            <Users size={14} /> WhatsApp Group ID
          </label>
          <input
            value={groupId}
            onChange={(e) => handleGroupInput(e.target.value)}
            placeholder="120363426488518199@g.us"
            style={inputStyle}
          />
          <p style={hintStyle}>Format: numeric-id@g.us — found in WAHA dashboard or group info</p>
        </div>
      )}

      <div>
        <label style={labelStyle}>Message</label>
        <textarea
          value={message}
          onChange={(e) => handleMessageInput(e.target.value)}
          placeholder="Type your message..."
          rows={5}
          style={{ ...inputStyle, resize: 'vertical', fontFamily: 'var(--font-body)' }}
          maxLength={4096}
        />
        <p style={hintStyle}>{message.length} / 4096 characters</p>
      </div>

      {feedback && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: feedback.type === 'success' ? 'var(--color-forest-soft)' : 'var(--color-coral-soft)',
            border: `1px solid ${feedback.type === 'success' ? 'var(--color-forest)' : 'var(--color-coral)'}`,
          }}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 size={16} color="var(--color-forest-deep)" style={{ flexShrink: 0, marginTop: 1 }} />
          ) : (
            <AlertCircle size={16} color="var(--color-coral-deep)" style={{ flexShrink: 0, marginTop: 1 }} />
          )}
          <span style={{ fontSize: 13, color: feedback.type === 'success' ? 'var(--color-forest-deep)' : 'var(--color-coral-deep)', lineHeight: 1.4 }}>
            {feedback.text}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '13px 20px',
          borderRadius: 'var(--radius-sm)',
          background: sending ? 'var(--color-ink-faint)' : 'var(--color-forest)',
          color: 'white',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: 14.5,
          letterSpacing: '0.01em',
          transition: 'background 0.15s ease, transform 0.1s ease',
        }}
        onMouseDown={(e) => !sending && (e.currentTarget.style.transform = 'scale(0.98)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {sending ? (
          <>
            <Loader2 size={17} className="spin" /> {mode === 'schedule' ? 'Scheduling...' : 'Sending...'}
          </>
        ) : (
          <>
            <Send size={16} /> {mode === 'schedule' ? 'Schedule message' : 'Send message'}
          </>
        )}
      </button>
    </form>
  )
}
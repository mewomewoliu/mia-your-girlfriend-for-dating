'use client'

import type { Message } from '@/lib/types'
import { InsightCard } from './InsightCard'

interface ChatBubbleProps {
  message: Message
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className="flex flex-col gap-1 animate-bubble-in"
      style={{ alignItems: isUser ? 'flex-end' : 'flex-start' }}
    >
      <div
        style={{
          maxWidth: '92%',
          background: isUser ? '#101010' : '#EDE8DF',
          borderRadius: 20,
          padding: '14px 18px',
          color: isUser ? 'rgba(255,255,255,0.90)' : '#101010',
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          fontWeight: 400,
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>

      {message.insightCard && (
        <div style={{ maxWidth: '92%' }}>
          <InsightCard text={message.insightCard.text} />
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        gap: 2,
        paddingLeft: isUser ? 0 : 2,
        paddingRight: isUser ? 2 : 0,
      }}>
        <span style={{ fontSize: 11, color: 'rgba(16,16,16,0.35)', fontFamily: 'var(--font-body)' }}>
          {formatTime(message.timestamp)}
        </span>
        <span style={{ fontSize: 12, color: '#101010', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
          {isUser ? '{You}' : '{Mia}'}
        </span>
      </div>
    </div>
  )
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

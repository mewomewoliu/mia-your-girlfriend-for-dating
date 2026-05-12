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
          maxWidth: '78%',
          background: isUser ? '#101010' : '#F3EFE9',
          border: 'none',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          padding: '10px 14px',
          color: isUser ? 'rgba(255,255,255,0.90)' : 'rgba(16,16,16,0.78)',
          fontFamily: 'var(--font-body)',
          fontSize: 14.5,
          fontWeight: isUser ? 400 : 300,
          lineHeight: 1.62,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}
      </div>

      {message.insightCard && (
        <div style={{ maxWidth: '78%' }}>
          <InsightCard text={message.insightCard.text} />
        </div>
      )}

      <span
        style={{
          fontSize: 9.5,
          color: 'rgba(16,16,16,0.25)',
          fontFamily: 'var(--font-body)',
          paddingLeft: isUser ? 0 : 2,
          paddingRight: isUser ? 2 : 0,
        }}
      >
        {formatTime(message.timestamp)}
      </span>
    </div>
  )
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

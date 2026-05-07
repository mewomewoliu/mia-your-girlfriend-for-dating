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
          background: isUser ? 'rgba(26,23,20,0.85)' : 'var(--card-bg)',
          border: isUser
            ? '1px solid rgba(200,149,108,0.28)'
            : '0.5px solid rgba(200,149,108,0.20)',
          borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
          padding: '10px 14px',
          color: isUser ? 'rgba(245,239,232,0.88)' : 'var(--text-card)',
          fontFamily: 'var(--font-body)',
          fontSize: 14.5,
          fontWeight: isUser ? 400 : 300,
          lineHeight: 1.6,
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
          color: 'rgba(245,239,232,0.25)',
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

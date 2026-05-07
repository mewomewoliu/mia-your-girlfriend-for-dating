'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Background } from '@/components/Background'
import { MiaLogo } from '@/components/MiaLogo'
import { NavBar } from '@/components/NavBar'
import { ChatBubble } from '@/components/ChatBubble'
import { TypingIndicator } from '@/components/TypingIndicator'
import { QuickReply } from '@/components/QuickReply'
import { storage } from '@/lib/storage'
import { useLanguage } from '@/lib/language-context'
import type { Message, UserProfile, PortraitData, InsightCardData } from '@/lib/types'

function parseInsightCard(raw: string): { content: string; insightCard?: InsightCardData } {
  const match = raw.match(/\[INSIGHT_CARD:\s*([\s\S]*?)\]/)
  if (!match) return { content: raw }
  return {
    content: raw.replace(/\[INSIGHT_CARD:[\s\S]*?\]/, '').trim(),
    insightCard: { text: match[1].trim() },
  }
}

export default function ChatPage() {
  const router = useRouter()
  const { lang, t } = useLanguage()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [portrait, setPortrait] = useState<PortraitData | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const p = storage.getProfile()
    if (!p?.onboardingComplete) {
      router.replace('/')
      return
    }
    setProfile(p)
    setPortrait(storage.getPortrait())

    const saved = storage.getMessages()
    const openingMessage: Message = {
      id: 'opening',
      role: 'assistant',
      content: t.openingMsg,
      timestamp: new Date().toISOString(),
    }
    setMessages(saved.length > 0 ? saved : [openingMessage])
  }, [router, t.openingMsg])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    setShowReplies(
      messages.length > 0 && messages[messages.length - 1].role === 'assistant' && !isTyping
    )
  }, [messages, isTyping])

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return
    setInput('')
    setShowReplies(false)

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    }

    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    storage.setMessages(nextMessages)
    setIsTyping(true)

    const apiMessages = nextMessages.map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, profile, portrait, language: lang }),
      })

      if (!res.ok || !res.body) throw new Error('stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date().toISOString(),
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, assistantMsg])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const { content, insightCard } = parseInsightCard(accumulated)
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...assistantMsg, content, insightCard }
          return updated
        })
      }

      const { content, insightCard } = parseInsightCard(accumulated)
      const finalMsg: Message = { ...assistantMsg, content, insightCard }
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = finalMsg
        storage.setMessages(updated)
        return updated
      })
    } catch {
      setIsTyping(false)
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t.chatError,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => {
        const updated = [...prev, errMsg]
        storage.setMessages(updated)
        return updated
      })
    }
  }, [messages, isTyping, profile, portrait])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  if (!profile) return null

  const canSend = input.trim() && !isTyping

  return (
    <>
      <Background />
      <div className="flex flex-col h-dvh">
        {/* Header */}
        <div
          style={{
            background: 'rgba(16,13,10,0.94)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(200,149,108,0.18)',
            padding: '14px 20px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
            paddingTop: 'max(14px, env(safe-area-inset-top))',
          }}
        >
          <MiaLogo size={28} />
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, color: 'rgba(245,239,232,0.92)', lineHeight: 1 }}>
              mia
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(245,239,232,0.38)', marginTop: 2 }}>
              {t.yourRelFriend}
            </p>
          </div>
          {profile.name && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(245,239,232,0.22)', marginLeft: 'auto' }}>
              {profile.name}
            </p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '16px 16px 0' }}>
          <div className="flex flex-col gap-4 max-w-lg mx-auto">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} style={{ height: 8 }} />
          </div>
        </div>

        {/* Quick replies */}
        {showReplies && !isTyping && (
          <div className="max-w-lg mx-auto w-full">
            <QuickReply
              options={t.quickReplies as unknown as string[]}
              onSelect={(opt) => sendMessage(opt)}
            />
          </div>
        )}

        {/* Input bar */}
        <div
          style={{
            background: 'rgba(16,13,10,0.92)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(200,149,108,0.12)',
            padding: '10px 16px',
            paddingBottom: 'calc(60px + max(10px, env(safe-area-inset-bottom)))',
            flexShrink: 0,
          }}
        >
          <form onSubmit={handleSubmit} className="flex gap-2 items-center max-w-lg mx-auto">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.sayAnything}
              style={{
                flex: 1,
                background: 'rgba(26,23,20,0.65)',
                border: '1px solid rgba(200,149,108,0.35)',
                borderRadius: 26,
                padding: '10px 16px',
                color: 'rgba(245,239,232,0.88)',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 200ms',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(200,149,108,0.65)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(200,149,108,0.35)' }}
            />
            <button
              type="submit"
              disabled={!canSend}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                background: canSend ? '#1A1714' : 'rgba(26,23,20,0.40)',
                border: `1px solid ${canSend ? 'rgba(200,149,108,0.55)' : 'rgba(245,239,232,0.08)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: canSend ? 'pointer' : 'not-allowed',
                transition: 'all 160ms ease',
                flexShrink: 0,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke={canSend ? '#C8956C' : 'rgba(245,239,232,0.22)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={canSend ? '#C8956C' : 'rgba(245,239,232,0.22)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </div>
      <NavBar />
    </>
  )
}

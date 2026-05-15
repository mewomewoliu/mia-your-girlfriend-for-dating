'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { ChatBubble } from '@/components/ChatBubble'
import { TypingIndicator } from '@/components/TypingIndicator'
import { QuickReply } from '@/components/QuickReply'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
import { getProfile, getPortrait, getMessages, appendMessage } from '@/lib/db'
import { useLanguage } from '@/lib/language-context'
import { useMobile } from '@/lib/hooks'
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
  const [userId, setUserId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [compatibilityContext, setCompatibilityContext] = useState<{ partnerName: string; sections: { wiredDifferently: string; naturalAlignment: string; payAttention: string; chemistryVsLongevity: string } } | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    const stored = sessionStorage.getItem('mia_compatibility_context')
    let ctx: typeof compatibilityContext = null
    if (stored) {
      try { ctx = JSON.parse(stored) } catch { /* ignore */ }
      sessionStorage.removeItem('mia_compatibility_context')
      if (ctx) setCompatibilityContext(ctx)
    }

    const supabase = getSupabaseBrowser()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace('/login'); return }
      setUserId(user.id)
      const [p, po, saved] = await Promise.all([
        getProfile(supabase, user.id),
        getPortrait(supabase, user.id),
        getMessages(supabase, user.id),
      ])
      if (!p) { router.replace('/'); return }
      setProfile(p)
      setPortrait(po)
      const openingContent = ctx
        ? (lang === 'zh'
            ? `i刚刚读了你和${ctx.partnerName}的相容性报告。你心里在想什么？`
            : `i just read your compatibility with ${ctx.partnerName}. what's coming up for you?`)
        : t.openingMsg
      const openingMessage: Message = {
        id: 'opening',
        role: 'assistant',
        content: openingContent,
        timestamp: new Date().toISOString(),
      }
      setMessages(saved.length > 0 ? saved : [openingMessage])
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

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
    if (userId) appendMessage(getSupabaseBrowser(), userId, userMsg).catch(console.error)
    setIsTyping(true)

    const apiMessages = nextMessages.map((m) => ({ role: m.role, content: m.content }))

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, profile, portrait, language: lang, compatibilityContext }),
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
        return updated
      })
      if (userId) appendMessage(getSupabaseBrowser(), userId, finalMsg).catch(console.error)
    } catch {
      setIsTyping(false)
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t.chatError,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errMsg])
    }
  }, [messages, isTyping, profile, portrait, lang, userId, compatibilityContext])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  if (!profile) return null

  const canSend = input.trim() && !isTyping

  /* ── Mobile layout ────────────────────────────── */
  if (isMobile) {
    return (
      <>
        <div className="flex flex-col h-dvh" style={{ background: '#1a1a1a' }}>

          {/* Golden tagline */}
          <div style={{ padding: 'max(16px, env(safe-area-inset-top)) 20px 12px', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 3.5vw, 13px)', color: '#C8956C', letterSpacing: '0.01em', fontWeight: 400 }}>
              {'{Mia: a girlfriend helps you date and love yourself }'}
            </span>
          </div>

          {/* White chat card */}
          <div style={{
            flex: 1,
            margin: '0 12px',
            background: '#fff',
            borderRadius: 20,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            position: 'relative',
          }}>
            {/* Flower background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/lily.png"
              alt=""
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '85%',
                maxWidth: 320,
                objectFit: 'contain',
                opacity: 0.5,
                pointerEvents: 'none',
                userSelect: 'none',
                zIndex: 0,
              }}
            />

            {/* Card header */}
            <div style={{ padding: '16px 16px 0', flexShrink: 0, position: 'relative', zIndex: 1 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 700, color: '#101010', letterSpacing: '-0.01em' }}>
                Chat
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto" style={{ padding: '12px 14px 0', position: 'relative', zIndex: 1 }}>
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <ChatBubble key={msg.id} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={bottomRef} style={{ height: 10 }} />
              </div>
            </div>

            {/* Quick replies inside card */}
            {showReplies && !isTyping && (
              <div style={{ position: 'relative', zIndex: 1 }}>
                <QuickReply
                  options={t.quickReplies as unknown as string[]}
                  onSelect={(opt) => sendMessage(opt)}
                />
              </div>
            )}
          </div>

          {/* Input bar — outside card, on dark bg */}
          <div style={{
            padding: '10px 12px',
            paddingBottom: 'calc(58px + max(10px, env(safe-area-inset-bottom)))',
            flexShrink: 0,
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'zh' ? '输入...' : 'Type in'}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.95)',
                  border: '1px solid rgba(255,255,255,0.20)',
                  borderRadius: 24,
                  padding: '11px 18px',
                  color: '#101010',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 200ms',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.30)' }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.20)' }}
              />
              <button
                type="submit"
                disabled={!canSend}
                style={{
                  height: 44,
                  borderRadius: 14,
                  background: canSend ? '#C8956C' : 'rgba(200,149,108,0.35)',
                  border: 'none',
                  padding: '0 18px',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: canSend ? 'pointer' : 'not-allowed',
                  transition: 'all 150ms ease',
                  flexShrink: 0,
                }}
              >
                {lang === 'zh' ? '发送' : 'Send'}
              </button>
            </form>
          </div>

        </div>
        <NavBar />
      </>
    )
  }

  /* ── Desktop layout ───────────────────────────── */
  return (
    <>
      <div className="flex flex-col h-dvh" style={{ background: '#FAFAF8' }}>

        {/* Header */}
        <div style={{
          background: 'rgba(18,17,16,0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '11px 20px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
          paddingTop: 'max(11px, env(safe-area-inset-top))',
        }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 11, color: 'rgba(255,255,255,0.85)', lineHeight: 1 }}>m</span>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 17, color: 'rgba(255,255,255,0.90)', lineHeight: 1 }}>mia</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{t.yourRelFriend}</p>
          </div>
          {profile.name && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.28)', marginLeft: 'auto' }}>{profile.name}</p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto" style={{ padding: '14px 14px 0', background: '#FAFAF8' }}>
          <div className="flex flex-col gap-3 max-w-lg mx-auto">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={bottomRef} style={{ height: 8 }} />
          </div>
        </div>

        {/* Quick replies */}
        {showReplies && !isTyping && (
          <div className="max-w-lg mx-auto w-full" style={{ background: '#FAFAF8' }}>
            <QuickReply options={t.quickReplies as unknown as string[]} onSelect={(opt) => sendMessage(opt)} />
          </div>
        )}

        {/* Input bar */}
        <div style={{
          background: 'rgba(18,17,16,0.97)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '8px 16px',
          paddingBottom: 'calc(58px + max(8px, env(safe-area-inset-bottom)))',
          flexShrink: 0,
        }}>
          <form onSubmit={handleSubmit} className="flex gap-2 items-center max-w-lg mx-auto">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.sayAnything}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 24,
                padding: '9px 16px',
                color: 'rgba(255,255,255,0.85)',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                outline: 'none',
                transition: 'border-color 200ms',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.35)' }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.14)' }}
            />
            <button
              type="submit"
              disabled={!canSend}
              style={{
                width: 36, height: 36, borderRadius: '50%',
                background: canSend ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.10)',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: canSend ? 'pointer' : 'not-allowed',
                transition: 'all 150ms ease', flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke={canSend ? '#101010' : 'rgba(255,255,255,0.25)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={canSend ? '#101010' : 'rgba(255,255,255,0.25)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>

      </div>
      <NavBar />
    </>
  )
}

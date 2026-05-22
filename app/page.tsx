'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
import { getProfile } from '@/lib/db'
import { useLanguage } from '@/lib/language-context'
import { useMobile } from '@/lib/hooks'
import type { UserProfile, BirthData, Intentions } from '@/lib/types'

type Step = 'welcome' | 'birth' | 'q1' | 'q2' | 'q3' | 'generating' | 'chart'
type MagicState = 'idle' | 'sending' | 'sent' | 'error'

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.252 17.64 11.945 17.64 9.2z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

function CelestialCircle() {
  return (
    <svg viewBox="0 0 200 200" fill="none" style={{ width: '100%', height: '100%' }}>
      <circle cx="100" cy="100" r="92" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="70" stroke="rgba(0,0,0,0.10)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="48" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="26" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
      <line x1="8" y1="100" x2="192" y2="100" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
      <line x1="100" y1="8" x2="100" y2="192" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
      <line x1="35" y1="35" x2="165" y2="165" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
      <line x1="165" y1="35" x2="35" y2="165" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
      <circle cx="100" cy="8" r="2" fill="rgba(245,165,35,0.55)" />
      <circle cx="100" cy="192" r="2" fill="rgba(245,165,35,0.55)" />
      <circle cx="8" cy="100" r="2" fill="rgba(245,165,35,0.55)" />
      <circle cx="192" cy="100" r="2" fill="rgba(245,165,35,0.55)" />
      <circle cx="35" cy="35" r="1.5" fill="rgba(0,0,0,0.18)" />
      <circle cx="165" cy="35" r="1.5" fill="rgba(0,0,0,0.18)" />
      <circle cx="35" cy="165" r="1.5" fill="rgba(0,0,0,0.18)" />
      <circle cx="165" cy="165" r="1.5" fill="rgba(0,0,0,0.18)" />
      <circle cx="100" cy="100" r="3" fill="rgba(245,165,35,0.70)" />
      <text x="100" y="122" textAnchor="middle" fontFamily="var(--font-display)" fontStyle="italic" fontSize="22" fill="rgba(0,0,0,0.38)">mia</text>
    </svg>
  )
}

function SplitScreen({ imgSrc, imgFit = 'contain', onBack, children }: {
  imgSrc: string
  imgFit?: 'cover' | 'contain'
  onBack?: () => void
  children: React.ReactNode
}) {
  return (
    <div className="welcome-root animate-fade-in">
      {/* Top bar */}
      <div style={{ height: 56, padding: '0 20px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Back"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: 17, lineHeight: 1, padding: '2px 0', flexShrink: 0, display: 'flex', alignItems: 'center' }}
          >
            ←
          </button>
        )}
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#C8A84B', letterSpacing: '0.01em', fontWeight: 400 }}>
          {lang === 'zh' ? '{Mia: 帮助你建立内在的信任 }' : '{Mia: build trust from the inside out }'}
        </span>
      </div>

      {/* Split area */}
      <div style={{ flex: 1, padding: '0 16px 16px', display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        <div className="welcome-split">
          <div className="welcome-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgSrc} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: imgFit, pointerEvents: 'none' }} />
          </div>
          <div className="welcome-right">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { lang, setLang, t } = useLanguage()
  const [step, setStep] = useState<Step>('welcome')
  const [birth, setBirth] = useState<BirthData>({ date: '', time: '', city: '' })
  const [intentions, setIntentions] = useState<Intentions>({ wantInLove: '', repeatingPattern: '', feelingSafe: '' })
  const [name, setName] = useState('')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [generatingError, setGeneratingError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [magicEmail, setMagicEmail] = useState('')
  const [magicState, setMagicState] = useState<MagicState>('idle')
  const [magicError, setMagicError] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setAuthChecked(true)
      if (!user) return
      setUserId(user.id)
      const pendingName = sessionStorage.getItem('mia_pending_name')
      if (pendingName) { setName(pendingName); sessionStorage.removeItem('mia_pending_name') }
      const existing = await getProfile(supabase, user.id)
      if (existing?.onboardingComplete) router.replace('/chat')
    })
  }, [router])

  async function handleGoogleSignIn() {
    if (name.trim()) sessionStorage.setItem('mia_pending_name', name.trim())
    setGoogleLoading(true)
    const supabase = getSupabaseBrowser()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    if (!magicEmail.trim()) return
    if (name.trim()) sessionStorage.setItem('mia_pending_name', name.trim())
    setMagicState('sending')
    setMagicError('')
    const supabase = getSupabaseBrowser()
    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback`, shouldCreateUser: true },
    })
    if (error) { setMagicError(error.message); setMagicState('error') }
    else setMagicState('sent')
  }

  async function generateChart() {
    setStep('generating')
    setGeneratingError('')
    try {
      const res = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate: birth.date, birthTime: birth.time, birthCity: birth.city, intentions, language: lang, name: name || undefined }),
      })
      if (!res.ok) throw new Error('Chart generation failed')
      const chart = await res.json()
      const newProfile: UserProfile = {
        name: name || undefined,
        birth,
        intentions,
        chart,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
        language: lang,
      }
      setProfile(newProfile)
      setStep('chart')
    } catch {
      setGeneratingError(t.q3Error)
      setStep('q3')
    }
  }

  /* ── Shared style tokens ────────────────────── */
  const si: React.CSSProperties = {
    width: '100%',
    background: '#fff',
    border: '1.5px solid rgba(200,149,108,0.75)',
    borderRadius: 10,
    padding: '12px 14px',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'rgba(0,0,0,0.70)',
    outline: 'none',
    textAlign: 'center',
    transition: 'border-color 200ms',
    boxSizing: 'border-box',
  }

  const sb: React.CSSProperties = {
    width: '100%',
    background: '#101010',
    border: 'none',
    borderRadius: 10,
    padding: '13px 14px',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    transition: 'opacity 160ms',
  }

  const sl: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 400,
    color: '#101010',
    display: 'block',
    marginBottom: 7,
  }

  const sh: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 'clamp(18px, 2vw, 24px)',
    fontWeight: 700,
    color: '#101010',
    letterSpacing: '-0.02em',
    lineHeight: 1.3,
  }

  function fa(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = 'rgba(200,149,108,1)'
  }
  function ba(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = 'rgba(200,149,108,0.75)'
  }

  const nl = lang === 'zh' ? '下一步' : 'Next step'

  /* ── WELCOME ─────────────────────────────────── */
  if (step === 'welcome') {
    const wInput: React.CSSProperties = {
      width: '100%',
      background: '#fff',
      border: '1.5px solid rgba(200,149,108,0.75)',
      borderRadius: 10,
      padding: '14px 16px',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'rgba(0,0,0,0.70)',
      outline: 'none',
      textAlign: 'center',
      transition: 'border-color 200ms',
      boxSizing: 'border-box',
    }
    const faw = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(200,149,108,1)' }
    const baw = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(200,149,108,0.75)' }
    const blue = '#1A1AFF'

    return (
      <div className="welcome-root animate-fade-in" style={{ background: '#14141a', overflowY: 'auto', overflowX: 'hidden' }}>
        {/* Top bar */}
        <div style={{ padding: '16px 20px', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#C8A84B', letterSpacing: '0.01em', fontWeight: 400 }}>
            {lang === 'zh' ? '{Mia: 帮助你培养关系 }' : '{Mia: help you to nurture relationships }'}
          </span>
        </div>

        {/* Cards */}
        <div style={{ padding: '4px 16px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: '100%', maxWidth: 460 }}>

            {/* Hero card */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(24px, 4vw, 36px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, marginBottom: 12 }}>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3.5vw, 26px)', fontWeight: 700, fontStyle: 'italic', color: blue, textAlign: 'center', margin: 0, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                {lang === 'zh' ? 'Mia 是你的镜子' : 'Mia is your mirror'}
              </h1>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/flower.png"
                alt=""
                style={{ width: 'clamp(150px, 42%, 200px)', aspectRatio: '1 / 1', objectFit: 'contain', pointerEvents: 'none' }}
              />
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.6vw, 16px)', lineHeight: 1.7, color: blue, textAlign: 'center', margin: 0, maxWidth: 340 }}>
                {lang === 'zh'
                  ? '不是帮你读懂他的心。是帮你听见自己的声音。'
                  : "not to decode him. to help you hear yourself."}
              </p>
            </div>

            {/* Form card */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 'clamp(20px, 4vw, 28px)', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 28 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(17px, 2.5vw, 22px)', fontWeight: 700, color: '#101010', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.3 }}>
                  {lang === 'zh' ? '{ 你叫什么名字？}' : "{ what's your name? }"}
                </p>
                {/* Language pill */}
                <div style={{ display: 'flex', background: 'rgba(0,0,0,0.06)', borderRadius: 20, padding: 3, flexShrink: 0 }}>
                  <button
                    onClick={() => setLang('en')}
                    style={{ background: lang === 'en' ? '#fff' : 'none', border: 'none', borderRadius: 16, padding: '5px 12px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: lang === 'en' ? '#101010' : 'rgba(0,0,0,0.40)', cursor: 'pointer', transition: 'all 150ms', boxShadow: lang === 'en' ? '0 1px 3px rgba(0,0,0,0.10)' : 'none' }}
                  >EN</button>
                  <button
                    onClick={() => setLang('zh')}
                    style={{ background: lang === 'zh' ? '#fff' : 'none', border: 'none', borderRadius: 16, padding: '5px 12px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: lang === 'zh' ? '#101010' : 'rgba(0,0,0,0.40)', cursor: 'pointer', transition: 'all 150ms', boxShadow: lang === 'zh' ? '0 1px 3px rgba(0,0,0,0.10)' : 'none' }}
                  >中文</button>
                </div>
              </div>

              <input
                style={wInput}
                placeholder={lang === 'zh' ? '你叫什么？（可选）' : 'What should I call you(optional)'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && userId) setStep('birth') }}
                onFocus={faw} onBlur={baw}
              />

              <div style={{ height: 28 }} />

              {/* Authenticated: Next step */}
              {userId && (
                <button
                  onClick={() => setStep('birth')}
                  style={{ width: '100%', background: '#101010', border: 'none', borderRadius: 10, padding: '15px 14px', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: '#fff', cursor: 'pointer', transition: 'opacity 160ms' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.80' }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
                >
                  {lang === 'zh' ? '下一步' : 'Next step'}
                </button>
              )}

              {/* Not authenticated: auth options */}
              {authChecked && !userId && (
                <>
                  {magicState !== 'sent' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <button
                        onClick={handleGoogleSignIn}
                        disabled={googleLoading}
                        style={{
                          width: '100%', background: '#fff', border: '1px solid rgba(0,0,0,0.14)', borderRadius: 10,
                          padding: '13px 14px', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
                          color: 'rgba(0,0,0,0.70)', cursor: googleLoading ? 'not-allowed' : 'pointer',
                          opacity: googleLoading ? 0.55 : 1, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', gap: 9, transition: 'all 150ms', boxSizing: 'border-box',
                        }}
                        onMouseEnter={(e) => { if (!googleLoading) e.currentTarget.style.borderColor = 'rgba(0,0,0,0.28)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.14)' }}
                      >
                        <GoogleIcon />
                        {googleLoading
                          ? (lang === 'zh' ? '跳转中...' : 'redirecting...')
                          : (lang === 'zh' ? '使用 Google 继续' : 'continue with Google')}
                      </button>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(0,0,0,0.30)', letterSpacing: '0.04em' }}>{lang === 'zh' ? '或' : 'or'}</span>
                        <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                      </div>
                      <form onSubmit={handleMagicLink} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <input
                          type="email"
                          placeholder={lang === 'zh' ? '你的邮箱' : 'your@email.com'}
                          value={magicEmail}
                          onChange={(e) => setMagicEmail(e.target.value)}
                          required
                          style={{ ...wInput }}
                          onFocus={faw} onBlur={baw}
                        />
                        {magicState === 'error' && (
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#c0392b', textAlign: 'center' }}>{magicError}</p>
                        )}
                        <button
                          type="submit"
                          disabled={magicState === 'sending' || !magicEmail.trim()}
                          style={{
                            width: '100%', background: '#101010', border: 'none', borderRadius: 10,
                            padding: '14px 14px', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600,
                            color: '#fff', cursor: magicState === 'sending' || !magicEmail.trim() ? 'not-allowed' : 'pointer',
                            opacity: magicState === 'sending' || !magicEmail.trim() ? 0.40 : 1, transition: 'opacity 160ms',
                          }}
                        >
                          {magicState === 'sending'
                            ? (lang === 'zh' ? '发送中...' : 'sending...')
                            : (lang === 'zh' ? '发送魔法链接 →' : 'send magic link →')}
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 0' }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: '#101010', letterSpacing: '-0.01em' }}>
                        {lang === 'zh' ? '查看你的邮箱' : 'check your email'}
                      </p>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 300, color: 'rgba(0,0,0,0.50)', lineHeight: 1.6 }}>
                        {lang === 'zh'
                          ? `我们已向 ${magicEmail} 发送了一个魔法链接。点击它即可登录。`
                          : `we sent a magic link to ${magicEmail}. click it to sign in.`}
                      </p>
                      <button
                        onClick={() => { setMagicState('idle'); setMagicEmail('') }}
                        style={{ background: 'none', border: 'none', fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(0,0,0,0.30)', cursor: 'pointer' }}
                      >
                        {lang === 'zh' ? '使用其他邮箱' : 'use a different email'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    )
  }

  /* ── BIRTH ───────────────────────────────────── */
  if (step === 'birth') {
    const canNext = !!(birth.date && birth.city)

    /* ── Mobile layout ── */
    if (isMobile) {
      const mInput: React.CSSProperties = {
        width: '100%', background: '#fff',
        border: '1.5px solid rgba(200,149,108,0.75)',
        borderRadius: 10, padding: '15px 16px',
        fontFamily: 'var(--font-body)', fontSize: 16,
        color: 'rgba(0,0,0,0.55)', outline: 'none',
        textAlign: 'center', transition: 'border-color 180ms',
        boxSizing: 'border-box',
      }
      const mLabel: React.CSSProperties = {
        fontFamily: 'var(--font-body)', fontSize: 14,
        fontWeight: 400, color: '#101010',
        display: 'block', marginBottom: 7,
      }
      const mFocus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(200,149,108,1)' }
      const mBlur  = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(200,149,108,0.75)' }

      return (
        <div style={{ position: 'fixed', inset: 0, background: '#14141a', display: 'flex', flexDirection: 'column', overflowY: 'auto', overflowX: 'hidden' }}>
          {/* Top bar */}
          <div style={{ padding: '16px 20px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={() => setStep('welcome')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: 18, lineHeight: 1, padding: 0 }}>←</button>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#C8A84B', letterSpacing: '0.01em', fontWeight: 400 }}>
              {lang === 'zh' ? '{Mia: 帮助你培养关系 }' : '{Mia: help you to nurture relationships }'}
            </span>
          </div>

          <div style={{ padding: '4px 16px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ width: '100%', maxWidth: 460, display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* Form card */}
              <div style={{ background: '#fff', borderRadius: 20, padding: '20px 20px 28px' }}>
                {/* Language pill */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.06)', borderRadius: 20, padding: 3 }}>
                    <button onClick={() => setLang('en')} style={{ background: lang === 'en' ? '#fff' : 'none', border: 'none', borderRadius: 16, padding: '5px 12px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: lang === 'en' ? '#101010' : 'rgba(0,0,0,0.40)', cursor: 'pointer', transition: 'all 150ms', boxShadow: lang === 'en' ? '0 1px 3px rgba(0,0,0,0.10)' : 'none' }}>EN</button>
                    <button onClick={() => setLang('zh')} style={{ background: lang === 'zh' ? '#fff' : 'none', border: 'none', borderRadius: 16, padding: '5px 12px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: lang === 'zh' ? '#101010' : 'rgba(0,0,0,0.40)', cursor: 'pointer', transition: 'all 150ms', boxShadow: lang === 'zh' ? '0 1px 3px rgba(0,0,0,0.10)' : 'none' }}>中文</button>
                  </div>
                </div>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 700, color: '#101010', letterSpacing: '-0.01em', lineHeight: 1.3, marginBottom: 24 }}>
                  {lang === 'zh' ? '{ 我需要知道你的八字，生日}' : '{ I need to know your Bazi, birthday}'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={mLabel}>{lang === 'zh' ? '出生日期' : 'Birth Date'}</label>
                    <input type="text" style={mInput} value={birth.date}
                      onChange={(e) => setBirth({ ...birth, date: e.target.value })}
                      placeholder="YYYY-MM-DD" onFocus={mFocus} onBlur={mBlur} />
                  </div>
                  <div>
                    <label style={mLabel}>{lang === 'zh' ? '出生时间' : 'Birth Time'}</label>
                    <input type="text" style={mInput} value={birth.time}
                      onChange={(e) => setBirth({ ...birth, time: e.target.value })}
                      placeholder={lang === 'zh' ? 'HH:MM（可选）' : 'HH:MM'}
                      onFocus={mFocus} onBlur={mBlur} />
                  </div>
                  <div>
                    <label style={mLabel}>{lang === 'zh' ? '出生城市' : 'Birth City'}</label>
                    <input type="text" style={mInput} value={birth.city}
                      onChange={(e) => setBirth({ ...birth, city: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter' && canNext) setStep('q1') }}
                      placeholder={lang === 'zh' ? '例如 北京，中国' : 'e.g. Stockholm, Sweden'}
                      onFocus={mFocus} onBlur={mBlur} />
                  </div>
                </div>

                <div style={{ height: 32 }} />

                <button
                  style={{ width: '100%', background: canNext ? '#101010' : 'rgba(16,16,16,0.22)', border: 'none', borderRadius: 10, padding: '15px 14px', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: '#fff', cursor: canNext ? 'pointer' : 'not-allowed', transition: 'opacity 160ms' }}
                  onClick={() => canNext && setStep('q1')}
                >
                  {lang === 'zh' ? '下一步' : 'Next step'}
                </button>
              </div>

              {/* Illustration card */}
              <div style={{ background: '#fff', borderRadius: 20, padding: '32px 24px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/lily.png" alt="" style={{ width: 'clamp(110px, 38%, 150px)', objectFit: 'contain' }} />
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, fontStyle: 'italic', color: '#1A1AFF', textAlign: 'center', margin: 0 }}>
                  {lang === 'zh' ? '你值得被爱' : "You're valued to be loved"}
                </p>
              </div>

            </div>
          </div>
        </div>
      )
    }

    /* ── Desktop layout (unchanged) ── */
    const hd = lang === 'zh'
      ? '{ 你的出生时间和地点\n将解锁你的八字和星盘 }'
      : '{ Your birth time and place will unlock\nyour Bazi and astrological chart }'
    const sub = name
      ? (lang === 'zh' ? `嗨 ${name}。从你的出生日期开始。` : `hi ${name}. let's start with when you were born.`)
      : (lang === 'zh' ? '从你的出生日期开始。' : "let's start with when you were born.")

    return (
      <SplitScreen imgSrc="/lily.png" imgFit="contain" onBack={() => setStep('welcome')}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vh, 20px)' }}>
          <div>
            <p style={sh}>
              {hd.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 300, color: 'rgba(16,16,16,0.48)', lineHeight: 1.5, marginTop: 6 }}>
              {sub}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={sl}>{t.birthDate}</label>
              <input
                type="date"
                style={si}
                value={birth.date}
                onChange={(e) => setBirth({ ...birth, date: e.target.value })}
                onFocus={fa} onBlur={ba}
              />
            </div>
            <div>
              <label style={sl}>
                {t.birthTime}{' '}
                <span style={{ opacity: 0.55, fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>{t.birthTimeOptional}</span>
              </label>
              <input
                type="time"
                style={si}
                value={birth.time}
                onChange={(e) => setBirth({ ...birth, time: e.target.value })}
                onFocus={fa} onBlur={ba}
              />
            </div>
            <div>
              <label style={sl}>{t.birthCity}</label>
              <input style={si} placeholder={t.birthCityPlaceholder} value={birth.city}
                onChange={(e) => setBirth({ ...birth, city: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter' && canNext) setStep('q1') }}
                onFocus={fa} onBlur={ba} />
            </div>
          </div>

          <button
            style={{ ...sb, marginTop: 'auto', opacity: canNext ? 1 : 0.32, cursor: canNext ? 'pointer' : 'not-allowed' }}
            onClick={() => canNext && setStep('q1')}
          >
            {nl}
          </button>
        </div>
      </SplitScreen>
    )
  }

  /* ── Q1 ──────────────────────────────────────── */
  if (step === 'q1') {
    const q1h = lang === 'zh' ? '{ 你现在在爱情中最想要的是什么？ }' : '{ what do you most want right now in love? }'
    const isCustom = !!(intentions.wantInLove && !(t.wantOptions as readonly string[]).includes(intentions.wantInLove))

    return (
      <SplitScreen imgSrc="/butterflies.png" imgFit="contain" onBack={() => setStep('birth')}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.6vh, 16px)' }}>
          <p style={sh}>{q1h}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <label style={sl}>{lang === 'zh' ? '选项' : 'Options'}</label>
            {t.wantOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { setIntentions({ ...intentions, wantInLove: opt }); setStep('q2') }}
                style={{
                  padding: '9px 13px',
                  borderRadius: 8,
                  background: 'transparent',
                  border: '1px solid rgba(245,165,35,0.40)',
                  color: '#101010',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 300,
                  cursor: 'pointer',
                  textAlign: 'left' as const,
                  transition: 'all 150ms ease',
                  lineHeight: 1.4,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245,165,35,0.06)'; e.currentTarget.style.borderColor = 'rgba(245,165,35,0.70)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(245,165,35,0.40)' }}
              >
                {opt}
              </button>
            ))}
            <input
              style={{ ...si, marginTop: 2 }}
              placeholder={lang === 'zh' ? '输入你的答案...' : 'Type in...'}
              value={isCustom ? intentions.wantInLove : ''}
              onChange={(e) => setIntentions({ ...intentions, wantInLove: e.target.value })}
              onKeyDown={(e) => { if (e.key === 'Enter' && intentions.wantInLove) setStep('q2') }}
              onFocus={fa} onBlur={ba}
            />
          </div>

          {isCustom && (
            <button style={{ ...sb, marginTop: 'auto' }} onClick={() => setStep('q2')}>{nl}</button>
          )}
        </div>
      </SplitScreen>
    )
  }

  /* ── Q2 ──────────────────────────────────────── */
  if (step === 'q2') {
    const q2h = lang === 'zh'
      ? "{ 你在关系中不断重复的一件事是什么？ }"
      : "{ what's one thing you keep repeating in relationships\nthat you'd like to understand? }"

    return (
      <SplitScreen imgSrc="/net.png" imgFit="cover" onBack={() => setStep('q1')}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vh, 20px)' }}>
          <p style={sh}>
            {q2h.split('\n').map((l, i, a) => <span key={i}>{l}{i < a.length - 1 && <br />}</span>)}
          </p>

          <textarea
            style={{ ...si, borderRadius: 10, minHeight: 100, resize: 'none', lineHeight: 1.6, flex: 1 }}
            placeholder={lang === 'zh' ? '我总是...' : 'I always seem to...'}
            value={intentions.repeatingPattern}
            onChange={(e) => setIntentions({ ...intentions, repeatingPattern: e.target.value })}
            onFocus={fa} onBlur={ba}
          />

          <button
            style={{ ...sb, opacity: intentions.repeatingPattern.trim() ? 1 : 0.32, cursor: intentions.repeatingPattern.trim() ? 'pointer' : 'not-allowed' }}
            onClick={() => intentions.repeatingPattern.trim() && setStep('q3')}
          >
            {nl}
          </button>
        </div>
      </SplitScreen>
    )
  }

  /* ── Q3 ──────────────────────────────────────── */
  if (step === 'q3') {
    const q3h = lang === 'zh'
      ? '{ 对你来说，在爱情中感到安全意味着什么？ }'
      : "{ what does feeling safe in love mean to you? }"

    return (
      <SplitScreen imgSrc="/heart.png" imgFit="cover" onBack={() => setStep('q2')}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vh, 20px)' }}>
          <p style={sh}>{q3h}</p>

          <textarea
            style={{ ...si, borderRadius: 10, minHeight: 100, resize: 'none', lineHeight: 1.6, flex: 1 }}
            placeholder={t.q3Placeholder}
            value={intentions.feelingSafe}
            onChange={(e) => setIntentions({ ...intentions, feelingSafe: e.target.value })}
            onFocus={fa} onBlur={ba}
          />

          {generatingError && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#c0392b', textAlign: 'center' }}>{generatingError}</p>
          )}

          <button
            style={{ ...sb, opacity: intentions.feelingSafe.trim() ? 1 : 0.32, cursor: intentions.feelingSafe.trim() ? 'pointer' : 'not-allowed' }}
            onClick={() => intentions.feelingSafe.trim() && generateChart()}
          >
            {lang === 'zh' ? '生成我的图表' : 'Generate my chart'}
          </button>
        </div>
      </SplitScreen>
    )
  }

  /* ── GENERATING ──────────────────────────────── */
  if (step === 'generating') {
    return (
      <div className="welcome-root animate-fade-in">
        <div style={{ height: 56, padding: '0 20px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#C8A84B', letterSpacing: '0.01em', fontWeight: 400 }}>
            {lang === 'zh' ? '{Mia: 帮助你建立内在的信任 }' : '{Mia: build trust from the inside out }'}
          </span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '0 24px' }}>
          <div style={{ position: 'relative', width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(200,149,108,0.35)', animation: 'pulse-ring 2.4s ease-in-out infinite' }} />
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(200,149,108,0.20)' }} />
            <div style={{ position: 'absolute', width: 4, height: 4, borderRadius: '50%', background: 'rgba(200,149,108,0.90)' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.01em', marginBottom: 6 }}>
              {lang === 'zh' ? '正在读取你的星盘...' : 'Reading your chart...'}
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.40)', lineHeight: 1.6 }}>
              {lang === 'zh' ? '这可能需要几秒钟' : 'This may take a moment'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(200,149,108,0.70)', display: 'block', animation: `typing 1.4s ease-in-out infinite`, animationDelay: `${i * 0.22}s` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── CHART ───────────────────────────────────── */
  if (step === 'chart' && profile?.chart) {
    return (
      <div className="welcome-root animate-fade-in" style={{ overflowY: 'auto' }}>
        <div style={{ height: 56, padding: '0 20px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#C8A84B', letterSpacing: '0.01em', fontWeight: 400 }}>
            {lang === 'zh' ? '{Mia: 帮助你建立内在的信任 }' : '{Mia: build trust from the inside out }'}
          </span>
        </div>

        <div style={{ flex: 1, padding: '8px 16px 28px', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 'clamp(20px, 3vw, 32px)', maxWidth: 520, width: '100%', display: 'flex', flexDirection: 'column', gap: 18, alignSelf: 'flex-start' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, flexShrink: 0 }}><CelestialCircle /></div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(18px, 2vw, 22px)', fontWeight: 700, color: '#101010', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                {name
                  ? (lang === 'zh' ? `${name}，这是你的图表` : `${name}, here's your reading`)
                  : (lang === 'zh' ? '这是你的图表' : "here's your reading")}
              </p>
            </div>

            {/* Chips */}
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
              {[
                { label: t.labelElement, value: profile.chart.dominantElement },
                { label: t.labelSun, value: profile.chart.sunSign },
                { label: t.labelZodiac, value: profile.chart.chineseZodiac },
              ].map(({ label: lbl, value }) => (
                <div key={lbl} style={{ border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, padding: '5px 11px', background: 'transparent' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 600, color: '#9b8340', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 1 }}>{lbl}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#101010', fontWeight: 400 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300, color: 'rgba(0,0,0,0.60)', lineHeight: 1.68 }}>
              {profile.chart.summary}
            </p>

            {/* Insights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {profile.chart.insights.map((insight, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 600, color: '#9b8340', letterSpacing: '0.04em', marginTop: 3, flexShrink: 0, minWidth: 18 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300, color: 'rgba(0,0,0,0.62)', lineHeight: 1.65 }}>{insight}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push('/chat')}
              style={{ ...sb, marginTop: 4 }}
            >
              {lang === 'zh' ? '开始和 Mia 聊天 →' : 'Start talking to Mia →'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

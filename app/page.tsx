'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/storage'
import { useLanguage } from '@/lib/language-context'
import type { UserProfile, BirthData, Intentions } from '@/lib/types'

type Step = 'welcome' | 'birth' | 'q1' | 'q2' | 'q3' | 'generating' | 'chart'

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
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.01em', fontWeight: 400 }}>
          {'{Mia: a girlfriend helps you date and love yourself }'}
        </span>
      </div>

      {/* Split area */}
      <div style={{ flex: 1, padding: '0 16px 16px', display: 'flex', minHeight: 0 }}>
        <div style={{ flex: 1, display: 'flex', gap: 14, minHeight: 0 }}>
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
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [generatingError, setGeneratingError] = useState('')

  useEffect(() => {
    const existing = storage.getProfile()
    if (existing?.onboardingComplete) router.replace('/chat')
  }, [router])

  async function generateChart() {
    setStep('generating')
    setGeneratingError('')
    try {
      const res = await fetch('/api/chart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ birthDate: birth.date, birthTime: birth.time, birthCity: birth.city, intentions, language: lang }),
      })
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
      storage.setProfile(newProfile)
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
    border: '1px solid rgba(0,0,0,0.12)',
    borderRadius: 8,
    padding: '12px 14px',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'rgba(0,0,0,0.70)',
    outline: 'none',
    textAlign: 'center',
    transition: 'border-color 200ms',
  }

  const sb: React.CSSProperties = {
    width: '100%',
    background: '#101010',
    border: 'none',
    borderRadius: 8,
    padding: '13px 14px',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
    cursor: 'pointer',
    transition: 'opacity 160ms',
  }

  const sl: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 10,
    fontWeight: 500,
    color: 'rgba(0,0,0,0.40)',
    letterSpacing: '0.07em',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: 5,
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
    e.target.style.borderColor = 'rgba(0,0,0,0.35)'
  }
  function ba(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.target.style.borderColor = 'rgba(0,0,0,0.12)'
  }

  const nl = lang === 'zh' ? '下一步' : 'Next step'

  /* ── WELCOME ─────────────────────────────────── */
  if (step === 'welcome') {
    const wInput: React.CSSProperties = {
      width: '100%',
      background: '#fff',
      border: '1px solid rgba(0,0,0,0.12)',
      borderRadius: 8,
      padding: '13px 15px',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'rgba(0,0,0,0.70)',
      outline: 'none',
      textAlign: 'center',
      transition: 'border-color 200ms',
    }
    const faw = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(0,0,0,0.35)' }
    const baw = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor = 'rgba(0,0,0,0.12)' }

    return (
      <div className="welcome-root animate-fade-in">
        {/* Top nav */}
        <div style={{ height: 56, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.01em', fontWeight: 400 }}>
            {'{Mia: a girlfriend helps you date and love yourself }'}
          </span>
          <button
            onClick={() => setStep('birth')}
            style={{ background: '#2b2b2b', border: 'none', borderRadius: 6, padding: '7px 16px', color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Say Hi
          </button>
        </div>

        <div style={{ flex: 1, padding: '0 16px 16px', display: 'flex', minHeight: 0 }}>
          <div style={{ flex: 1, display: 'flex', gap: 14, minHeight: 0 }}>

            <div className="welcome-left">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/flower.png" alt="" style={{ position: 'absolute', top: '-5.58%', left: '-10%', width: '120%', height: '111%', objectFit: 'cover', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(20px, 3vw, 40px)' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontStyle: 'normal', fontSize: 'clamp(28px, 3.8vw, 48px)', lineHeight: 1.25, color: '#101010', marginBottom: 12 }}>
                  {lang === 'zh' ? (
                    <>Mia <span style={{ color: '#7a6830' }}>是你的</span>女朋友</>
                  ) : (
                    <>Mia <span style={{ color: '#7a6830' }}>is your</span> girlfriend</>
                  )}
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(13px, 1.3vw, 17px)', lineHeight: 1.65, color: 'rgba(60,48,20,0.75)', maxWidth: 380, fontWeight: 400 }}>
                  {lang === 'zh' ? '我在这里帮助你更聪明地恋爱，更清晰地理解爱。更重要的是，帮助你了解自己和爱自己。' : "I'm here to help you date smarter and feel clearer about love. And more importantly, I will help you to know yourself and love yourself while chase your love on other."}
                </p>
              </div>
            </div>

            <div className="welcome-right">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'clamp(16px, 2.5vh, 28px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <button onClick={() => setLang('en')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: lang === 'en' ? '#101010' : '#9b8340', padding: '4px 6px', fontWeight: lang === 'en' ? 500 : 400 }}>EN</button>
                  <span style={{ color: 'rgba(0,0,0,0.20)', fontSize: 13 }}>|</span>
                  <button onClick={() => setLang('zh')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, color: lang === 'zh' ? '#101010' : '#9b8340', padding: '4px 6px', fontWeight: lang === 'zh' ? 500 : 400 }}>中文</button>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vh, 24px)' }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(22px, 2.5vw, 28px)', fontWeight: 700, color: '#101010', letterSpacing: '-0.02em', lineHeight: 1.25, whiteSpace: 'pre-line' }}>
                  {lang === 'zh' ? '{ 开始吧\n你叫什么名字？}' : "{ Get started\nwhat's your name? }"}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input style={wInput} placeholder={t.namePlaceholder} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setStep('birth')} onFocus={faw} onBlur={baw} />
                  <input type="email" style={wInput} placeholder={lang === 'zh' ? '你的邮箱是什么？' : "What's your email?"} value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setStep('birth')} onFocus={faw} onBlur={baw} />
                </div>
                <button onClick={() => setStep('birth')} style={{ width: '100%', background: '#101010', border: 'none', borderRadius: 8, padding: '13px 14px', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#fff', cursor: 'pointer', transition: 'opacity 160ms' }} onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.80' }} onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}>
                  {lang === 'zh' ? '下一步' : 'Next step'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    )
  }

  /* ── BIRTH ───────────────────────────────────── */
  if (step === 'birth') {
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
              <input type="date" style={si} value={birth.date} onChange={(e) => setBirth({ ...birth, date: e.target.value })} onFocus={fa} onBlur={ba} />
            </div>
            <div>
              <label style={sl}>
                {t.birthTime}{' '}
                <span style={{ opacity: 0.55, fontStyle: 'italic', textTransform: 'none', letterSpacing: 0 }}>{t.birthTimeOptional}</span>
              </label>
              <input type="time" style={si} value={birth.time} onChange={(e) => setBirth({ ...birth, time: e.target.value })} onFocus={fa} onBlur={ba} />
            </div>
            <div>
              <label style={sl}>{t.birthCity}</label>
              <input style={si} placeholder={t.birthCityPlaceholder} value={birth.city}
                onChange={(e) => setBirth({ ...birth, city: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter' && birth.date && birth.city) setStep('q1') }}
                onFocus={fa} onBlur={ba} />
            </div>
          </div>

          <button
            style={{ ...sb, marginTop: 'auto', opacity: birth.date && birth.city ? 1 : 0.32, cursor: birth.date && birth.city ? 'pointer' : 'not-allowed' }}
            onClick={() => birth.date && birth.city && setStep('q1')}
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
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.01em', fontWeight: 400 }}>
            {'{Mia: a girlfriend helps you date and love yourself }'}
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
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.01em', fontWeight: 400 }}>
            {'{Mia: a girlfriend helps you date and love yourself }'}
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

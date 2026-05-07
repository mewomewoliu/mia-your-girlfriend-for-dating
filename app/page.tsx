'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Background } from '@/components/Background'
import { MiaLogo } from '@/components/MiaLogo'
import { storage } from '@/lib/storage'
import { useLanguage } from '@/lib/language-context'
import type { UserProfile, BirthData, Intentions } from '@/lib/types'

type Step = 'welcome' | 'birth' | 'q1' | 'q2' | 'q3' | 'generating' | 'chart'

function CelestialCircle() {
  return (
    <svg viewBox="0 0 200 200" fill="none" style={{ width: '100%', height: '100%' }}>
      <circle cx="100" cy="100" r="92" stroke="rgba(200,149,108,0.16)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="70" stroke="rgba(200,149,108,0.20)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="48" stroke="rgba(200,149,108,0.16)" strokeWidth="0.5" />
      <circle cx="100" cy="100" r="26" stroke="rgba(200,149,108,0.12)" strokeWidth="0.5" />
      <line x1="8" y1="100" x2="192" y2="100" stroke="rgba(200,149,108,0.10)" strokeWidth="0.5" />
      <line x1="100" y1="8" x2="100" y2="192" stroke="rgba(200,149,108,0.10)" strokeWidth="0.5" />
      <line x1="35" y1="35" x2="165" y2="165" stroke="rgba(200,149,108,0.07)" strokeWidth="0.5" />
      <line x1="165" y1="35" x2="35" y2="165" stroke="rgba(200,149,108,0.07)" strokeWidth="0.5" />
      <circle cx="100" cy="8" r="2.5" fill="rgba(200,149,108,0.55)" />
      <circle cx="100" cy="192" r="2.5" fill="rgba(200,149,108,0.55)" />
      <circle cx="8" cy="100" r="2.5" fill="rgba(200,149,108,0.55)" />
      <circle cx="192" cy="100" r="2.5" fill="rgba(200,149,108,0.55)" />
      <circle cx="35" cy="35" r="1.5" fill="rgba(200,149,108,0.32)" />
      <circle cx="165" cy="35" r="1.5" fill="rgba(200,149,108,0.32)" />
      <circle cx="35" cy="165" r="1.5" fill="rgba(200,149,108,0.32)" />
      <circle cx="165" cy="165" r="1.5" fill="rgba(200,149,108,0.32)" />
      <circle cx="100" cy="100" r="3" fill="rgba(200,149,108,0.65)" />
      <text x="100" y="122" textAnchor="middle"
        fontFamily="var(--font-display)" fontStyle="italic" fontSize="24"
        fill="rgba(200,149,108,0.72)">mia</text>
    </svg>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const { lang, setLang, t } = useLanguage()
  const [step, setStep] = useState<Step>('welcome')
  const [birth, setBirth] = useState<BirthData>({ date: '', time: '', city: '' })
  const [intentions, setIntentions] = useState<Intentions>({
    wantInLove: '',
    repeatingPattern: '',
    feelingSafe: '',
  })
  const [name, setName] = useState('')
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

  /* ── Style tokens ── */
  const card: React.CSSProperties = {
    background: 'var(--card-bg)',
    borderRadius: 24,
    boxShadow: 'var(--card-shadow)',
    border: '0.5px solid var(--card-border)',
  }

  const fieldInput: React.CSSProperties = {
    width: '100%',
    padding: '13px 20px',
    borderRadius: 20,
    background: 'rgba(255,255,255,0.72)',
    border: '1px solid rgba(200,149,108,0.32)',
    color: 'var(--text-card)',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 200ms',
  }

  const btn: React.CSSProperties = {
    width: '100%',
    padding: '13px 24px',
    borderRadius: 50,
    background: 'var(--btn)',
    border: 'none',
    color: 'rgba(245,239,232,0.92)',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transition: 'opacity 160ms ease',
    letterSpacing: '0.01em',
  }

  const title: React.CSSProperties = {
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontSize: 28,
    color: 'var(--text-card)',
    lineHeight: 1.25,
  }

  const body: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontWeight: 300,
    fontSize: 14,
    color: 'var(--text-card-secondary)',
    lineHeight: 1.65,
  }

  const fieldLabel: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 10,
    fontWeight: 500,
    color: 'var(--text-card-muted)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
    display: 'block',
    marginBottom: 6,
  }

  const langBtn = (active: boolean): React.CSSProperties => ({
    padding: '5px 11px',
    borderRadius: 8,
    background: active ? 'rgba(200,149,108,0.14)' : 'transparent',
    border: active ? '1px solid rgba(200,149,108,0.45)' : '1px solid transparent',
    color: active ? 'var(--gold)' : 'var(--text-card-muted)',
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: active ? 600 : 400,
    cursor: 'pointer',
    transition: 'all 160ms ease',
    letterSpacing: '0.04em',
  })

  const focusGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'var(--gold-focus)'
  }
  const blurGold = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.target.style.borderColor = 'rgba(200,149,108,0.32)'
  }

  return (
    <>
      <Background />

      <div style={{ position: 'fixed', top: 20, left: 20, zIndex: 10 }}>
        <MiaLogo size={28} />
      </div>

      <div className="flex items-center justify-center min-h-dvh px-5 py-10">

        {/* ── WELCOME ───────────────────────────────── */}
        {step === 'welcome' && (
          <div className="animate-fade-in w-full max-w-sm flex flex-col">
            <div style={{ ...card, display: 'flex', flexDirection: 'column', minHeight: 520 }}>

              {/* Card header */}
              <div style={{ padding: '22px 22px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <p style={{ ...title, fontSize: 26, marginBottom: 8 }}>
                    {t.tagline.split('\n').map((l, i, arr) => (
                      <span key={i}>{l}{i < arr.length - 1 && <br />}</span>
                    ))}
                  </p>
                  <p style={{ ...body, fontSize: 13, opacity: 0.75 }}>{t.taglineSub}</p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  background: 'rgba(200,149,108,0.08)',
                  border: '1px solid rgba(200,149,108,0.20)',
                  borderRadius: 12,
                  padding: '3px 4px',
                  flexShrink: 0,
                }}>
                  <button style={langBtn(lang === 'en')} onClick={() => setLang('en')}>EN</button>
                  <button style={langBtn(lang === 'zh')} onClick={() => setLang('zh')}>中文</button>
                </div>
              </div>

              {/* Celestial art */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 24px' }}>
                <div style={{ width: '100%', maxWidth: 190, aspectRatio: '1' }}>
                  <CelestialCircle />
                </div>
              </div>

              {/* Controls */}
              <div style={{ padding: '14px 18px 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  style={fieldInput}
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setStep('birth')}
                  onFocus={focusGold}
                  onBlur={blurGold}
                />
                <button style={btn} onClick={() => setStep('birth')}>
                  {t.letsBegin}
                  <span style={{ color: 'var(--gold)', fontSize: 16 }}>→</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── BIRTH ─────────────────────────────────── */}
        {step === 'birth' && (
          <div className="animate-fade-in w-full max-w-sm" style={{ ...card, padding: '26px 22px' }}>
            <div style={{ marginBottom: 20 }}>
              <p style={title}>
                {t.birthIntro(name).split('\n').map((l, i, arr) => (
                  <span key={i}>{l}{i < arr.length - 1 && <br />}</span>
                ))}
              </p>
              <p style={{ ...body, marginTop: 8 }}>{t.birthSub}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={fieldLabel}>{t.birthDate}</label>
                <input type="date" style={fieldInput} value={birth.date}
                  onChange={(e) => setBirth({ ...birth, date: e.target.value })}
                  onFocus={focusGold} onBlur={blurGold} />
              </div>
              <div>
                <label style={fieldLabel}>
                  {t.birthTime} <span style={{ opacity: 0.5, fontStyle: 'italic', textTransform: 'none' }}>{t.birthTimeOptional}</span>
                </label>
                <input type="time" style={fieldInput} value={birth.time}
                  onChange={(e) => setBirth({ ...birth, time: e.target.value })}
                  onFocus={focusGold} onBlur={blurGold} />
              </div>
              <div>
                <label style={fieldLabel}>{t.birthCity}</label>
                <input style={fieldInput} placeholder={t.birthCityPlaceholder} value={birth.city}
                  onChange={(e) => setBirth({ ...birth, city: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && birth.date && birth.city && setStep('q1')}
                  onFocus={focusGold} onBlur={blurGold} />
              </div>
            </div>

            <button
              style={{ ...btn, marginTop: 22, opacity: birth.date && birth.city ? 1 : 0.38,
                cursor: birth.date && birth.city ? 'pointer' : 'not-allowed' }}
              onClick={() => birth.date && birth.city && setStep('q1')}
            >
              {t.continue}
            </button>
          </div>
        )}

        {/* ── Q1 ────────────────────────────────────── */}
        {step === 'q1' && (
          <div className="animate-fade-in w-full max-w-sm" style={{ ...card, padding: '26px 22px' }}>
            <p style={{ ...title, marginBottom: 20, fontSize: 24 }}>
              {t.q1Title.split('\n').map((l, i, arr) => (
                <span key={i}>{l}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {t.wantOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setIntentions({ ...intentions, wantInLove: opt }); setStep('q2') }}
                  style={{
                    padding: '11px 16px',
                    borderRadius: 14,
                    background: intentions.wantInLove === opt
                      ? 'rgba(200,149,108,0.12)'
                      : 'rgba(255,255,255,0.55)',
                    border: `1px solid ${intentions.wantInLove === opt ? 'rgba(200,149,108,0.50)' : 'rgba(200,149,108,0.25)'}`,
                    color: 'var(--text-card)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 13.5,
                    fontWeight: 300,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 160ms ease',
                  }}
                >
                  {opt}
                </button>
              ))}
              <input
                style={{ ...fieldInput, marginTop: 4 }}
                placeholder={t.q1Custom}
                value={(t.wantOptions as readonly string[]).includes(intentions.wantInLove) ? '' : intentions.wantInLove}
                onChange={(e) => setIntentions({ ...intentions, wantInLove: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter' && intentions.wantInLove) setStep('q2') }}
                onFocus={focusGold} onBlur={blurGold}
              />
            </div>

            {intentions.wantInLove && (
              <button style={{ ...btn, marginTop: 18 }} onClick={() => setStep('q2')}>
                {t.continue}
              </button>
            )}
          </div>
        )}

        {/* ── Q2 ────────────────────────────────────── */}
        {step === 'q2' && (
          <div className="animate-fade-in w-full max-w-sm" style={{ ...card, padding: '26px 22px' }}>
            <p style={{ ...title, marginBottom: 6, fontSize: 24 }}>
              {t.q2Title.split('\n').map((l, i, arr) => (
                <span key={i}>{l}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>
            <p style={{ ...body, fontStyle: 'italic', marginBottom: 18 }}>{t.q2Sub}</p>

            <textarea
              style={{ ...fieldInput, borderRadius: 16, minHeight: 120, resize: 'none', lineHeight: 1.6 }}
              placeholder={t.q2Placeholder}
              value={intentions.repeatingPattern}
              onChange={(e) => setIntentions({ ...intentions, repeatingPattern: e.target.value })}
              onFocus={focusGold} onBlur={blurGold}
            />

            <button
              style={{ ...btn, marginTop: 18, opacity: intentions.repeatingPattern.trim() ? 1 : 0.38,
                cursor: intentions.repeatingPattern.trim() ? 'pointer' : 'not-allowed' }}
              onClick={() => intentions.repeatingPattern.trim() && setStep('q3')}
            >
              {t.continue}
            </button>
          </div>
        )}

        {/* ── Q3 ────────────────────────────────────── */}
        {step === 'q3' && (
          <div className="animate-fade-in w-full max-w-sm" style={{ ...card, padding: '26px 22px' }}>
            <p style={{ ...title, marginBottom: 18, fontSize: 24 }}>
              {t.q3Title.split('\n').map((l, i, arr) => (
                <span key={i}>{l}{i < arr.length - 1 && <br />}</span>
              ))}
            </p>

            <textarea
              style={{ ...fieldInput, borderRadius: 16, minHeight: 120, resize: 'none', lineHeight: 1.6 }}
              placeholder={t.q3Placeholder}
              value={intentions.feelingSafe}
              onChange={(e) => setIntentions({ ...intentions, feelingSafe: e.target.value })}
              onFocus={focusGold} onBlur={blurGold}
            />

            {generatingError && (
              <p style={{ ...body, color: '#c0392b', marginTop: 10, textAlign: 'center' }}>{generatingError}</p>
            )}

            <button
              style={{ ...btn, marginTop: 18, opacity: intentions.feelingSafe.trim() ? 1 : 0.38,
                cursor: intentions.feelingSafe.trim() ? 'pointer' : 'not-allowed' }}
              onClick={() => intentions.feelingSafe.trim() && generateChart()}
            >
              {t.generateChart}
              <span style={{ color: 'var(--gold)', fontSize: 14 }}>✦</span>
            </button>
          </div>
        )}

        {/* ── GENERATING ────────────────────────────── */}
        {step === 'generating' && (
          <div className="animate-fade-in flex flex-col items-center gap-6">
            <div style={{ position: 'relative', width: 88, height: 88, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '0.5px solid rgba(200,149,108,0.50)',
                animation: 'pulse-ring 2.4s ease-in-out infinite',
              }} />
              <div style={{
                width: 58,
                height: 58,
                borderRadius: '50%',
                border: '0.5px solid rgba(200,149,108,0.30)',
              }} />
              <div style={{
                position: 'absolute',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'var(--gold)',
              }} />
            </div>
            <p style={{ ...title, textAlign: 'center', color: 'rgba(245,239,232,0.90)' }}>{t.generatingTitle}</p>
            <p style={{ ...body, textAlign: 'center', color: 'rgba(245,239,232,0.48)' }}>{t.generatingSub}</p>
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <span key={i} style={{
                  width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)', display: 'block',
                  animation: `typing 1.4s ease-in-out infinite`, animationDelay: `${i * 0.22}s`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* ── CHART ─────────────────────────────────── */}
        {step === 'chart' && profile?.chart && (
          <div className="animate-fade-in w-full max-w-sm" style={{ ...card, overflow: 'hidden' }}>

            {/* Chart header strip */}
            <div style={{
              padding: '22px 22px 18px',
              borderBottom: '1px solid rgba(200,149,108,0.18)',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}>
              <div style={{ width: 52, height: 52, flexShrink: 0 }}>
                <CelestialCircle />
              </div>
              <p style={{ ...title, fontSize: 22 }}>
                {t.chartIntro(name).split('\n').map((l, i, arr) => (
                  <span key={i}>{l}{i < arr.length - 1 && <br />}</span>
                ))}
              </p>
            </div>

            <div style={{ padding: '18px 22px 26px' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                {[
                  { label: t.labelElement, value: profile.chart.dominantElement },
                  { label: t.labelSun, value: profile.chart.sunSign },
                  { label: t.labelZodiac, value: profile.chart.chineseZodiac },
                ].map(({ label: lbl, value }) => (
                  <div key={lbl} style={{
                    background: '#1A1714',
                    border: '1px solid rgba(200,149,108,0.30)',
                    borderRadius: 10,
                    padding: '5px 10px',
                  }}>
                    <p style={{ fontSize: 8.5, color: 'rgba(200,149,108,0.60)', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{lbl}</p>
                    <p style={{ fontSize: 13, color: 'rgba(245,239,232,0.88)', fontFamily: 'var(--font-body)', fontWeight: 400, marginTop: 1 }}>{value}</p>
                  </div>
                ))}
              </div>

              <p style={{ ...body, marginBottom: 14 }}>{profile.chart.summary}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                {profile.chart.insights.map((insight, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 9.5,
                      fontWeight: 500,
                      color: 'var(--gold)',
                      letterSpacing: '0.04em',
                      marginTop: 2,
                      flexShrink: 0,
                      minWidth: 16,
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p style={{ ...body, fontSize: 13 }}>{insight}</p>
                  </div>
                ))}
              </div>

              <button style={btn} onClick={() => router.push('/chat')}>
                {t.startTalking}
                <span style={{ color: 'var(--gold)', fontSize: 14 }}>→</span>
              </button>
            </div>
          </div>
        )}

        {/* Step dots */}
        {!['welcome', 'generating', 'chart'].includes(step) && (
          <div className="flex gap-2 mt-6" style={{ position: 'absolute', bottom: 32 }}>
            {(['birth', 'q1', 'q2', 'q3'] as Step[]).map((s) => (
              <div key={s} style={{
                width: 5, height: 5, borderRadius: '50%',
                background: s === step ? 'var(--gold)' : 'rgba(200,149,108,0.25)',
                transition: 'all 300ms',
              }} />
            ))}
          </div>
        )}

      </div>
    </>
  )
}

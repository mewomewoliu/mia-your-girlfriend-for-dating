'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
import { getProfile, getCompatibility } from '@/lib/db'
import { useLanguage } from '@/lib/language-context'
import { useMobile } from '@/lib/hooks'
import type { UserProfile, CompatibilityReport } from '@/lib/types'

type ViewState = 'form' | 'generating' | 'report'

export default function CompatibilityPage() {
  const router = useRouter()
  const { lang, t } = useLanguage()
  const isMobile = useMobile()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [view, setView] = useState<ViewState>('form')
  const [partnerName, setPartnerName] = useState('')
  const [partnerBirthDate, setPartnerBirthDate] = useState('')
  const [partnerBirthTime, setPartnerBirthTime] = useState('')
  const [partnerBirthCity, setPartnerBirthCity] = useState('')
  const [report, setReport] = useState<CompatibilityReport | null>(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState<CompatibilityReport[]>([])

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace('/login'); return }
      const [p, h] = await Promise.all([
        getProfile(supabase, user.id),
        getCompatibility(supabase, user.id),
      ])
      if (!p) { router.replace('/'); return }
      setProfile(p)
      setHistory(h)
    })
  }, [router])

  async function generate() {
    if (!partnerBirthDate || !profile) return
    setView('generating')
    setError('')
    try {
      const res = await fetch('/api/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, partnerName, partnerBirthDate, partnerBirthTime, partnerBirthCity, language: lang }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setReport(data)
      const supabase = getSupabaseBrowser()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const updated = await getCompatibility(supabase, user.id)
        setHistory(updated)
      }
      setView('report')
    } catch {
      setError(t.compatError)
      setView('form')
    }
  }

  if (!profile) return null

  const canGenerate = !!partnerBirthDate

  const fieldInput: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.55)',
    border: '1.5px solid #C8956C',
    borderRadius: 12,
    padding: '14px 16px',
    color: '#101010',
    fontFamily: 'var(--font-body)',
    fontSize: 15,
    outline: 'none',
    textAlign: 'center',
    transition: 'border-color 200ms, background 200ms',
  }

  const fieldLabel: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 12,
    color: 'rgba(16,16,16,0.60)',
    display: 'block',
    marginBottom: 7,
    fontWeight: 400,
  }

  const goldLabel: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 9.5,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#C8956C',
    marginBottom: 10,
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(200,149,108,0.90)'
    e.target.style.background = '#fff'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = '#C8956C'
    e.target.style.background = 'rgba(255,255,255,0.55)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: '#1a1a1a', paddingBottom: 80 }}>

      {/* Tagline */}
      <div style={{ padding: 'max(16px, env(safe-area-inset-top)) 20px 12px', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#C8956C', letterSpacing: '0.01em', fontWeight: 400 }}>
          {'{Mia: a girlfriend helps you date and love yourself }'}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>

          {/* ── FORM ─────────────────────────────── */}
          {view === 'form' && (
            <div style={{ background: '#F0EDEA', borderRadius: 24, overflow: 'hidden' }} className="animate-fade-in">

              {/* Heading */}
              <div style={{ padding: '24px 24px 0' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#101010', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                  {t.compatFormTitle.split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </p>
              </div>

              {/* Flower */}
              <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 24px 16px' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/lily.png" alt="" style={{ width: '66%', maxWidth: 240, objectFit: 'contain', opacity: 0.85 }} />
              </div>

              {/* Fields */}
              <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={fieldLabel}>{t.theirName}</label>
                  <input
                    style={fieldInput}
                    placeholder={t.nameSuffix ?? (lang === 'zh' ? '他/她的名字' : 'Their name')}
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    onFocus={onFocus} onBlur={onBlur}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>{t.birthDate}</label>
                  <input
                    type={isMobile ? 'text' : 'date'}
                    style={fieldInput}
                    placeholder="YYYY-MM-DD"
                    value={partnerBirthDate}
                    onChange={(e) => setPartnerBirthDate(e.target.value)}
                    onFocus={onFocus} onBlur={onBlur}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>
                    {t.birthTime}{' '}
                    <span style={{ opacity: 0.55, fontStyle: 'italic' }}>{t.birthTimeOptionalLabel}</span>
                  </label>
                  <input
                    type={isMobile ? 'text' : 'time'}
                    style={fieldInput}
                    placeholder="HH-MM"
                    value={partnerBirthTime}
                    onChange={(e) => setPartnerBirthTime(e.target.value)}
                    onFocus={onFocus} onBlur={onBlur}
                  />
                </div>
                <div>
                  <label style={fieldLabel}>
                    {t.birthCityOptionalLabel}{' '}
                    <span style={{ opacity: 0.55, fontStyle: 'italic' }}>{t.birthTimeOptionalLabel}</span>
                  </label>
                  <input
                    style={fieldInput}
                    placeholder={lang === 'zh' ? '例如 北京，中国' : 'e.g. Stockholm, Sweden'}
                    value={partnerBirthCity}
                    onChange={(e) => setPartnerBirthCity(e.target.value)}
                    onFocus={onFocus} onBlur={onBlur}
                  />
                </div>

                {error && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(200,149,108,0.80)', textAlign: 'center' }}>
                    {error}
                  </p>
                )}

                <button
                  onClick={generate}
                  disabled={!canGenerate}
                  style={{
                    width: '100%',
                    background: canGenerate ? '#101010' : 'rgba(16,16,16,0.22)',
                    border: 'none',
                    borderRadius: 12,
                    padding: '15px 20px',
                    color: canGenerate ? '#fff' : 'rgba(16,16,16,0.35)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: canGenerate ? 'pointer' : 'not-allowed',
                    transition: 'background 150ms',
                    marginTop: 4,
                  }}
                >
                  {lang === 'zh' ? '读取TA的星盘' : 'Read their chart'}
                </button>
              </div>

              {/* Past readings */}
              {history.length > 0 && (
                <div style={{ borderTop: '1px solid rgba(200,149,108,0.20)', padding: '20px 24px' }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(16,16,16,0.40)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                    {t.pastReadings}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {history.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => { setReport(r); setView('report') }}
                        style={{
                          background: 'rgba(255,255,255,0.55)',
                          border: '1px solid rgba(200,149,108,0.28)',
                          borderRadius: 12,
                          padding: '12px 16px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          width: '100%',
                        }}
                      >
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#101010', fontWeight: 500 }}>
                          {r.partnerName || (lang === 'zh' ? '未命名' : 'Unnamed')}
                        </span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(16,16,16,0.40)' }}>
                          {new Date(r.generatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── GENERATING ───────────────────────── */}
          {view === 'generating' && (
            <div className="flex flex-col items-center justify-center gap-6 animate-fade-in" style={{ minHeight: '60vh' }}>
              <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '0.5px solid rgba(200,149,108,0.45)', animation: 'pulse-ring 2.4s ease-in-out infinite' }} />
                <div style={{ width: 52, height: 52, borderRadius: '50%', border: '0.5px solid rgba(200,149,108,0.28)' }} />
                <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: '#C8956C' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'rgba(245,239,232,0.90)', textAlign: 'center' }}>
                {t.generatingReading}
              </p>
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#C8956C', display: 'block', animation: 'typing 1.4s ease-in-out infinite', animationDelay: `${i * 0.22}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* ── REPORT ───────────────────────────── */}
          {view === 'report' && report && (
            <div style={{ background: '#F0EDEA', borderRadius: 24, overflow: 'hidden' }} className="animate-fade-in">

              {/* Back + title */}
              <div style={{ padding: '24px 24px 20px' }}>
                <button
                  onClick={() => setView('form')}
                  style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(16,16,16,0.38)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 14, padding: 0 }}
                >
                  {t.backBtn}
                </button>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 26, color: '#101010', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                  {t.youAnd(report.partnerName || (lang === 'zh' ? 'TA' : 'them'))}
                </p>
              </div>

              {/* Report sections */}
              <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { title: t.sectionWired, content: report.sections.wiredDifferently },
                  { title: t.sectionAlign, content: report.sections.naturalAlignment },
                  { title: t.sectionAttention, content: report.sections.payAttention },
                  { title: t.sectionChemistry, content: report.sections.chemistryVsLongevity },
                ].map(({ title, content }) => (
                  <div key={title} style={{ background: '#E8E5E1', borderRadius: 16, padding: '16px' }}>
                    <p style={goldLabel}>{title}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300, color: '#C8956C', lineHeight: 1.7 }}>
                      {content}
                    </p>
                  </div>
                ))}

                {/* Questions */}
                <div style={{ background: '#E8E5E1', borderRadius: 16, padding: '16px' }}>
                  <p style={goldLabel}>{t.questionsTitle}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {report.sections.questionsToExplore.map((q, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: '#C8956C', fontSize: 10, marginTop: 4, flexShrink: 0 }}>✦</span>
                        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14, color: '#C8956C', lineHeight: 1.5 }}>
                          {q}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div style={{ padding: '24px' }}>
                <button
                  onClick={() => router.push('/chat')}
                  style={{ width: '100%', background: '#101010', border: 'none', borderRadius: 12, padding: '15px 20px', color: '#fff', fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}
                >
                  {t.talkToMia}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      <NavBar />
    </div>
  )
}

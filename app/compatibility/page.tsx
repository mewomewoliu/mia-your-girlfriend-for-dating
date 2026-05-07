'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Background } from '@/components/Background'
import { NavBar } from '@/components/NavBar'
import { storage } from '@/lib/storage'
import { useLanguage } from '@/lib/language-context'
import type { UserProfile, CompatibilityReport } from '@/lib/types'

type ViewState = 'form' | 'generating' | 'report'

export default function CompatibilityPage() {
  const router = useRouter()
  const { lang, t } = useLanguage()
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
    const p = storage.getProfile()
    if (!p?.onboardingComplete) { router.replace('/'); return }
    setProfile(p)
    setHistory(storage.getCompatibility())
  }, [router])

  async function generate() {
    if (!partnerName || !partnerBirthDate || !profile) return
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
      storage.addCompatibility(data)
      setHistory(storage.getCompatibility())
      setView('report')
    } catch {
      setError(t.compatError)
      setView('form')
    }
  }

  const card: React.CSSProperties = {
    background: 'var(--card-bg)',
    border: '0.5px solid var(--card-border)',
    borderRadius: 20,
    boxShadow: 'var(--card-shadow)',
  }

  const fieldInput: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.72)',
    border: '1px solid rgba(200,149,108,0.32)',
    borderRadius: 14,
    padding: '11px 16px',
    color: 'var(--text-card)',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 200ms',
  }

  const fieldLabel: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 10,
    color: 'var(--text-card-muted)',
    letterSpacing: '0.06em',
    display: 'block',
    marginBottom: 6,
  }

  const goldLabel: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 9.5,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1.1px',
    color: 'var(--gold)',
    marginBottom: 10,
  }

  const focusGold = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(200,149,108,0.65)'
  }
  const blurGold = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(200,149,108,0.32)'
  }

  if (!profile) return null

  return (
    <>
      <Background />
      <div className="flex flex-col min-h-dvh" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 80 }}>
        {/* Header */}
        <div style={{
          background: 'rgba(16,13,10,0.94)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(200,149,108,0.18)',
          padding: '16px 20px',
        }}>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: 'rgba(245,239,232,0.92)' }}>
            {t.compatTitle}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(245,239,232,0.38)', marginTop: 2 }}>
            {t.compatSub}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 max-w-lg mx-auto w-full">

          {view === 'form' && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'rgba(245,239,232,0.92)', lineHeight: 1.35 }}>
                {t.compatFormTitle.split('\n').map((line, i, arr) => (
                  <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                ))}
              </p>

              <div style={{ ...card, padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={fieldLabel}>{t.theirName}</label>
                    <input style={fieldInput} placeholder={t.nameSuffix} value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      onFocus={focusGold} onBlur={blurGold} />
                  </div>
                  <div>
                    <label style={fieldLabel}>{t.birthDate}</label>
                    <input type="date" style={fieldInput} value={partnerBirthDate}
                      onChange={(e) => setPartnerBirthDate(e.target.value)}
                      onFocus={focusGold} onBlur={blurGold} />
                  </div>
                  <div>
                    <label style={fieldLabel}>
                      {t.birthTime} <span style={{ opacity: 0.5, fontStyle: 'italic' }}>{t.birthTimeOptionalLabel}</span>
                    </label>
                    <input type="time" style={fieldInput} value={partnerBirthTime}
                      onChange={(e) => setPartnerBirthTime(e.target.value)}
                      onFocus={focusGold} onBlur={blurGold} />
                  </div>
                  <div>
                    <label style={fieldLabel}>
                      {t.birthCityOptionalLabel} <span style={{ opacity: 0.5, fontStyle: 'italic' }}>{t.birthTimeOptionalLabel}</span>
                    </label>
                    <input style={fieldInput} placeholder={t.cityPlaceholder} value={partnerBirthCity}
                      onChange={(e) => setPartnerBirthCity(e.target.value)}
                      onFocus={focusGold} onBlur={blurGold} />
                  </div>
                </div>
              </div>

              {error && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(245,239,232,0.40)', textAlign: 'center' }}>
                  {error}
                </p>
              )}

              <button
                onClick={generate}
                disabled={!partnerName || !partnerBirthDate}
                style={{
                  background: 'var(--btn)',
                  border: 'none',
                  borderRadius: 50,
                  padding: '13px 28px',
                  color: 'rgba(245,239,232,0.92)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: partnerName && partnerBirthDate ? 'pointer' : 'not-allowed',
                  opacity: partnerName && partnerBirthDate ? 1 : 0.38,
                  alignSelf: 'stretch',
                  transition: 'opacity 160ms',
                }}
              >
                {t.generateReading}
              </button>

              {history.length > 0 && (
                <div className="flex flex-col gap-3 mt-2">
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(245,239,232,0.32)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{t.pastReadings}</p>
                  {history.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => { setReport(r); setView('report') }}
                      style={{
                        ...card,
                        padding: '12px 16px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        border: '0.5px solid var(--card-border)',
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-card)' }}>{r.partnerName}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-card-muted)' }}>
                        {new Date(r.generatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {view === 'generating' && (
            <div className="flex flex-col items-center justify-center gap-6 animate-fade-in" style={{ minHeight: '60vh' }}>
              <div style={{ position: 'relative', width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '0.5px solid rgba(200,149,108,0.45)',
                  animation: 'pulse-ring 2.4s ease-in-out infinite',
                }} />
                <div style={{ width: 52, height: 52, borderRadius: '50%', border: '0.5px solid rgba(200,149,108,0.28)' }} />
                <div style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, color: 'rgba(245,239,232,0.90)', textAlign: 'center' }}>
                {t.generatingReading}
              </p>
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

          {view === 'report' && report && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div>
                <button
                  onClick={() => setView('form')}
                  style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(245,239,232,0.35)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 12 }}
                >
                  {t.backBtn}
                </button>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 26, color: 'rgba(245,239,232,0.92)', lineHeight: 1.3 }}>
                  {t.youAnd(report.partnerName)}
                </p>
              </div>

              {[
                { title: t.sectionWired, content: report.sections.wiredDifferently },
                { title: t.sectionAlign, content: report.sections.naturalAlignment },
                { title: t.sectionAttention, content: report.sections.payAttention },
                { title: t.sectionChemistry, content: report.sections.chemistryVsLongevity },
              ].map(({ title, content }) => (
                <div key={title} style={{ ...card, padding: '18px' }}>
                  <p style={goldLabel}>{title}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 300, color: 'var(--text-card-secondary)', lineHeight: 1.7 }}>
                    {content}
                  </p>
                </div>
              ))}

              {/* Questions */}
              <div style={{ ...card, padding: '18px', border: '0.5px solid rgba(200,149,108,0.25)' }}>
                <p style={goldLabel}>{t.questionsTitle}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {report.sections.questionsToExplore.map((q, i) => (
                    <p key={i} style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: 'var(--text-card-secondary)', lineHeight: 1.5, paddingLeft: 12, borderLeft: '2px solid rgba(200,149,108,0.38)' }}>
                      {q}
                    </p>
                  ))}
                </div>
              </div>

              <button
                onClick={() => router.push('/chat')}
                style={{
                  background: 'var(--btn)',
                  border: 'none',
                  borderRadius: 50,
                  padding: '13px 24px',
                  color: 'rgba(245,239,232,0.92)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                {t.talkToMia}
              </button>
            </div>
          )}
        </div>
      </div>
      <NavBar />
    </>
  )
}

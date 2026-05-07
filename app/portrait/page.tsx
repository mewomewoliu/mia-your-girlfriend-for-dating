'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Background } from '@/components/Background'
import { NavBar } from '@/components/NavBar'
import { MiaLogo } from '@/components/MiaLogo'
import { storage } from '@/lib/storage'
import { useLanguage } from '@/lib/language-context'
import type { UserProfile, PortraitData } from '@/lib/types'

export default function PortraitPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [portrait, setPortrait] = useState<PortraitData | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const p = storage.getProfile()
    if (!p?.onboardingComplete) { router.replace('/'); return }
    setProfile(p)
    setPortrait(storage.getPortrait())
  }, [router])

  function handleDelete() {
    storage.clearAll()
    router.replace('/')
  }

  const card: React.CSSProperties = {
    background: 'var(--card-bg)',
    border: '0.5px solid var(--card-border)',
    borderRadius: 20,
    boxShadow: 'var(--card-shadow)',
    padding: '18px',
  }

  const goldLabel: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 9.5,
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '1.1px',
    color: 'var(--gold)',
    marginBottom: 14,
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
            {t.portraitTitle}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(245,239,232,0.38)', marginTop: 2 }}>
            {t.portraitSub}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6 max-w-lg mx-auto w-full">
          <div className="flex flex-col gap-5 animate-fade-in">

            {/* Chart summary */}
            {profile.chart && (
              <div style={card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <MiaLogo size={22} />
                  <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 17, color: 'var(--text-card)' }}>
                    {t.yourChart}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                  {[
                    { l: t.labelElement, v: profile.chart.dominantElement },
                    { l: t.labelSunShort, v: profile.chart.sunSign },
                    { l: t.labelZodiac, v: profile.chart.chineseZodiac },
                  ].map(({ l, v }) => (
                    <div key={l} style={{
                      background: '#1A1714',
                      border: '1px solid rgba(200,149,108,0.28)',
                      borderRadius: 8,
                      padding: '4px 10px',
                    }}>
                      <p style={{ fontSize: 8.5, color: 'rgba(200,149,108,0.58)', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{l}</p>
                      <p style={{ fontSize: 12, color: 'rgba(245,239,232,0.88)', fontFamily: 'var(--font-body)' }}>{v}</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 300, color: 'var(--text-card-secondary)', lineHeight: 1.65 }}>
                  {profile.chart.summary}
                </p>
              </div>
            )}

            {/* Intentions */}
            <div style={card}>
              <p style={goldLabel}>{t.whatYouToldMe}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { q: t.wantInLoveLabel, a: profile.intentions.wantInLove },
                  { q: t.patternLabel, a: profile.intentions.repeatingPattern },
                  { q: t.safetyLabel, a: profile.intentions.feelingSafe },
                ].map(({ q, a }) => (
                  <div key={q}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'var(--text-card-muted)', marginBottom: 4 }}>{q}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: 'var(--text-card)', lineHeight: 1.5 }}>
                      "{a}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Portrait */}
            {portrait && portrait.patterns.length > 0 ? (
              <div style={card}>
                <p style={goldLabel}>{t.patternsNoticed}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {portrait.patterns.map((pattern, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--gold)', fontSize: 11, marginTop: 3, flexShrink: 0 }}>✦</span>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 300, color: 'var(--text-card-secondary)', lineHeight: 1.6 }}>
                        {pattern}
                      </p>
                    </div>
                  ))}
                </div>
                {portrait.idealPartnerPicture && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(200,149,108,0.18)' }}>
                    <p style={{ ...goldLabel, marginBottom: 8 }}>{t.idealPartnerTitle}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14, color: 'var(--text-card-secondary)', lineHeight: 1.65 }}>
                      {portrait.idealPartnerPicture}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ ...card, textAlign: 'center', padding: '28px 20px' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 16, color: 'var(--text-card-muted)', lineHeight: 1.5 }}>
                  {t.stillGettingToKnow}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 300, color: 'var(--text-card-muted)', marginTop: 8, lineHeight: 1.6, opacity: 0.7 }}>
                  {t.patternsEmerge}
                </p>
              </div>
            )}

            {/* Privacy */}
            <div style={{
              border: '1px solid rgba(200,149,108,0.18)',
              borderRadius: 12,
              padding: '14px 16px',
              background: 'rgba(26,23,20,0.40)',
            }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(245,239,232,0.35)', lineHeight: 1.6 }}>
                {t.privacyNote}
              </p>
            </div>

            {/* Delete */}
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(245,239,232,0.22)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'center', alignSelf: 'center' }}
              >
                {t.deleteData}
              </button>
            ) : (
              <div style={{ ...card, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-card)' }}>{t.deleteConfirm}</p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button
                    onClick={handleDelete}
                    style={{ background: 'rgba(180,60,60,0.10)', border: '1px solid rgba(180,60,60,0.32)', borderRadius: 18, padding: '8px 20px', color: '#e07070', fontFamily: 'var(--font-body)', fontSize: 13, cursor: 'pointer' }}
                  >
                    {t.deleteYes}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(200,149,108,0.28)', borderRadius: 18, padding: '8px 20px', color: 'var(--text-card)', fontFamily: 'var(--font-body)', fontSize: 13, cursor: 'pointer' }}
                  >
                    {t.deleteCancel}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <NavBar />
    </>
  )
}

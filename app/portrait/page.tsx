'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
import { getProfile, getPortrait, deleteAccount } from '@/lib/db'
import { useLanguage } from '@/lib/language-context'
import type { UserProfile, PortraitData } from '@/lib/types'

export default function PortraitPage() {
  const router = useRouter()
  const { lang, t } = useLanguage()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [portrait, setPortrait] = useState<PortraitData | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace('/login'); return }
      setUserId(user.id)
      const [p, po] = await Promise.all([
        getProfile(supabase, user.id),
        getPortrait(supabase, user.id),
      ])
      if (!p) { router.replace('/'); return }
      setProfile(p)
      setPortrait(po)
    })
  }, [router])

  async function handleDelete() {
    if (!userId) return
    const supabase = getSupabaseBrowser()
    await deleteAccount(supabase, userId)
    router.replace('/login')
  }

  if (!profile) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: '#14141a', paddingBottom: 80 }}>

      {/* Tagline */}
      <div style={{ padding: 'max(16px, env(safe-area-inset-top)) 20px 12px', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 3.5vw, 13px)', color: '#C8A84B', letterSpacing: '0.01em', fontWeight: 400 }}>
          {lang === 'zh' ? '{Mia: 帮助你建立内在的信任 }' : '{Mia: build trust from the inside out }'}
        </span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Action buttons row */}
          <div style={{ display: 'flex', gap: 10, padding: '4px 0 8px' }}>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                flex: 1,
                background: 'transparent',
                border: '1.5px solid rgba(242,140,140,0.55)',
                borderRadius: 10,
                padding: '12px 16px',
                color: '#F28C8C',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {lang === 'zh' ? '删除我的数据' : 'Erase my data'}
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                flex: 1,
                background: '#1A1AFF',
                border: 'none',
                borderRadius: 10,
                padding: '12px 16px',
                color: '#fff',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {lang === 'zh' ? '更新' : 'Update'}
            </button>
          </div>

          {/* Delete confirm overlay */}
          {showDeleteConfirm && (
            <div style={{ background: 'rgba(242,140,140,0.12)', border: '1px solid rgba(242,140,140,0.30)', borderRadius: 14, padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-in">
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.80)' }}>{t.deleteConfirm}</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleDelete}
                  style={{ flex: 1, background: 'rgba(180,60,60,0.22)', border: '1px solid rgba(180,60,60,0.45)', borderRadius: 10, padding: '10px', color: '#F28C8C', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                >
                  {t.deleteYes}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 10, padding: '10px', color: 'rgba(255,255,255,0.65)', fontFamily: 'var(--font-body)', fontSize: 13, cursor: 'pointer' }}
                >
                  {t.deleteCancel}
                </button>
              </div>
            </div>
          )}

          {/* Card 1 — Chart Reading */}
          {profile.chart && (
            <div
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                position: 'relative',
                minHeight: 340,
                display: 'flex',
                flexDirection: 'column',
              }}
              className="animate-fade-in"
            >
              {/* Texture background */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/texture-silk.png"
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
              />

              {/* Top content */}
              <div style={{ position: 'relative', zIndex: 1, padding: '22px 22px 0', flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(18px, 5.5vw, 24px)', color: '#fff', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: 14, textShadow: '0 1px 8px rgba(0,0,0,0.35)' }}>
                  {lang === 'zh' ? `Mia，你的星盘解读` : `Mia, your chart reading`}
                </p>

                {/* Chips row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                  {[
                    { prefix: '// Element |', value: profile.chart.dominantElement },
                    { prefix: '// Sun |', value: profile.chart.sunSign },
                    { prefix: '// Zodiac |', value: profile.chart.chineseZodiac },
                  ].map(({ prefix, value }) => (
                    <div
                      key={prefix}
                      style={{
                        background: 'rgba(0,0,0,0.32)',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        borderRadius: 20,
                        padding: '5px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{prefix}</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#fff', fontWeight: 600 }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peony center decoration */}
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', padding: '10px 0 4px', pointerEvents: 'none' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/peony.png" alt="" style={{ width: '62%', maxWidth: 220, objectFit: 'contain', filter: 'brightness(1.05)' }} />
              </div>

              {/* Frosted bottom overlay — summary */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                background: 'rgba(10,10,14,0.72)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                padding: '16px 20px 22px',
              }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>
                  {profile.chart.summary}
                </p>
              </div>
            </div>
          )}

          {/* Card 2 — Questions / Intentions */}
          <div
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              position: 'relative',
              minHeight: 260,
              display: 'flex',
              flexDirection: 'column',
            }}
            className="animate-fade-in"
          >
            {/* Texture background */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/texture-green.png"
              alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
            />

            {/* Top label */}
            <div style={{ position: 'relative', zIndex: 1, padding: '22px 22px 0', flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(18px, 5.5vw, 24px)', color: '#fff', lineHeight: 1.2, letterSpacing: '-0.01em', textShadow: '0 1px 8px rgba(0,0,0,0.45)' }}>
                {lang === 'zh' ? '问题' : 'Questions'}
              </p>
            </div>

            {/* Frosted bottom overlay — intentions */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              background: 'rgba(10,10,14,0.72)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              padding: '16px 20px 22px',
              marginTop: 60,
            }}>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 14 }}>
                {`// ${t.whatYouToldMe}`}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { q: t.wantInLoveLabel, a: profile.intentions.wantInLove },
                  { q: t.patternLabel, a: profile.intentions.repeatingPattern },
                  { q: t.safetyLabel, a: profile.intentions.feelingSafe },
                ].map(({ q, a }) => (
                  <div key={q}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 400, marginBottom: 3 }}>{q}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14, color: '#6B9EFF', lineHeight: 1.5 }}>
                      &ldquo;{a}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Patterns card (shown when portrait data exists) */}
          {portrait && portrait.patterns.length > 0 && (
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 20, padding: '20px', display: 'flex', flexDirection: 'column', gap: 10 }} className="animate-fade-in">
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 12, color: 'rgba(255,255,255,0.40)', marginBottom: 4 }}>
                {`// ${t.patternsNoticed}`}
              </p>
              {portrait.patterns.map((pattern, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: '#C8A84B', fontSize: 10, marginTop: 4, flexShrink: 0 }}>✦</span>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.68)', lineHeight: 1.6 }}>
                    {pattern}
                  </p>
                </div>
              ))}
              {portrait.idealPartnerPicture && (
                <div style={{ marginTop: 8, paddingTop: 14, borderTop: '1px dashed rgba(255,255,255,0.12)' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                    {`// ${t.idealPartnerTitle}`}
                  </p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>
                    {portrait.idealPartnerPicture}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Privacy note */}
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.20)', lineHeight: 1.6, textAlign: 'center', fontStyle: 'italic', padding: '4px 8px' }}>
            {t.privacyNote}
          </p>

        </div>
      </div>
      <NavBar />
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { NavBar } from '@/components/NavBar'
import { getSupabaseBrowser } from '@/lib/supabase/browser'
import { getProfile, getPortrait, deleteAccount } from '@/lib/db'
import { useLanguage } from '@/lib/language-context'
import type { UserProfile, PortraitData } from '@/lib/types'

function GalaxySketch() {
  return (
    <svg width="88" height="66" viewBox="0 0 130 95" fill="none">
      <ellipse cx="65" cy="47" rx="62" ry="26" transform="rotate(-18 65 47)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.5"/>
      <ellipse cx="65" cy="47" rx="52" ry="21" transform="rotate(-16 65 47)" stroke="rgba(0,0,0,0.10)" strokeWidth="0.6"/>
      <ellipse cx="65" cy="47" rx="42" ry="17" transform="rotate(-14 65 47)" stroke="rgba(0,0,0,0.13)" strokeWidth="0.7"/>
      <ellipse cx="65" cy="47" rx="32" ry="13" transform="rotate(-12 65 47)" stroke="rgba(0,0,0,0.17)" strokeWidth="0.9"/>
      <ellipse cx="65" cy="47" rx="22" ry="9" transform="rotate(-10 65 47)" stroke="rgba(0,0,0,0.21)" strokeWidth="1"/>
      <ellipse cx="65" cy="47" rx="13" ry="5" transform="rotate(-6 65 47)" stroke="rgba(0,0,0,0.27)" strokeWidth="1.2"/>
      <ellipse cx="65" cy="47" rx="6" ry="2.5" transform="rotate(-3 65 47)" stroke="rgba(0,0,0,0.36)" strokeWidth="1.4"/>
      <circle cx="8" cy="47" r="0.7" fill="rgba(0,0,0,0.13)"/>
      <circle cx="122" cy="47" r="0.7" fill="rgba(0,0,0,0.13)"/>
      <circle cx="18" cy="34" r="0.5" fill="rgba(0,0,0,0.10)"/>
      <circle cx="112" cy="60" r="0.5" fill="rgba(0,0,0,0.10)"/>
      <circle cx="22" cy="61" r="0.6" fill="rgba(0,0,0,0.12)"/>
      <circle cx="108" cy="34" r="0.6" fill="rgba(0,0,0,0.12)"/>
      <circle cx="34" cy="29" r="0.7" fill="rgba(0,0,0,0.16)"/>
      <circle cx="96" cy="65" r="0.7" fill="rgba(0,0,0,0.16)"/>
      <circle cx="27" cy="53" r="0.8" fill="rgba(0,0,0,0.18)"/>
      <circle cx="103" cy="41" r="0.8" fill="rgba(0,0,0,0.18)"/>
      <circle cx="48" cy="35" r="1.0" fill="rgba(0,0,0,0.26)"/>
      <circle cx="82" cy="59" r="1.0" fill="rgba(0,0,0,0.26)"/>
      <circle cx="65" cy="47" r="4.5" fill="rgba(0,0,0,0.38)"/>
      <circle cx="65" cy="47" r="2.2" fill="rgba(0,0,0,0.55)"/>
      <circle cx="65" cy="47" r="0.9" fill="rgba(0,0,0,0.75)"/>
    </svg>
  )
}

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

  const innerBox: React.CSSProperties = {
    background: '#E8E5E1',
    borderRadius: 16,
    padding: '16px',
  }

  const displayName = profile.name || (lang === 'zh' ? '你' : 'You')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: '#1a1a1a', paddingBottom: 80 }}>

      {/* Tagline */}
      <div style={{ padding: 'max(16px, env(safe-area-inset-top)) 20px 12px', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 3.5vw, 13px)', color: '#C8A84B', letterSpacing: '0.01em', fontWeight: 400 }}>
          {'{Mia: build trust from the inside out }'}
        </span>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>

          <div style={{ background: '#F0EDEA', borderRadius: 24, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in">

            {/* Header: name + galaxy */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 5vw, 22px)', fontWeight: 700, color: '#101010', lineHeight: 1.3, letterSpacing: '-0.01em', flex: 1, minWidth: 0 }}>
                {`{${displayName}}, ${lang === 'zh' ? '你的模式' : 'your pattern'}`}
              </p>
              <div style={{ flexShrink: 0, marginTop: 2 }}>
                <GalaxySketch />
              </div>
            </div>

            {/* Chart section */}
            {profile.chart && (
              <div style={innerBox}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 14 }}>
                  {[
                    { label: t.labelElement, value: profile.chart.dominantElement },
                    { label: t.labelSunShort, value: profile.chart.sunSign },
                    { label: t.labelZodiac, value: profile.chart.chineseZodiac },
                  ].map(({ label, value }) => (
                    <p key={label} style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#101010', lineHeight: 1.4 }}>
                      <span style={{ color: 'rgba(16,16,16,0.45)' }}>// {label} |{'  '}</span>
                      <span style={{ color: '#C8956C', fontWeight: 600 }}>{value}</span>
                    </p>
                  ))}
                </div>
                <div style={{ borderTop: '1px dashed rgba(200,149,108,0.40)', marginBottom: 14 }} />
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#C8956C', lineHeight: 1.7 }}>
                  {profile.chart.summary}
                </p>
              </div>
            )}

            {/* Intentions section */}
            <div style={innerBox}>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13, color: '#C8956C', marginBottom: 14 }}>
                {`// ${t.whatYouToldMe}`}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { q: t.wantInLoveLabel, a: profile.intentions.wantInLove },
                  { q: t.patternLabel, a: profile.intentions.repeatingPattern },
                  { q: t.safetyLabel, a: profile.intentions.feelingSafe },
                ].map(({ q, a }) => (
                  <div key={q}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#101010', fontWeight: 400, marginBottom: 3 }}>{q}</p>
                    <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 14, color: '#C8956C', lineHeight: 1.5 }}>
                      "{a}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Portrait patterns */}
            {portrait && portrait.patterns.length > 0 ? (
              <div style={innerBox}>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13, color: '#C8956C', marginBottom: 14 }}>
                  {`// ${t.patternsNoticed}`}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {portrait.patterns.map((pattern, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: '#C8956C', fontSize: 10, marginTop: 4, flexShrink: 0 }}>✦</span>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#C8956C', lineHeight: 1.6 }}>
                        {pattern}
                      </p>
                    </div>
                  ))}
                </div>
                {portrait.idealPartnerPicture && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px dashed rgba(200,149,108,0.40)' }}>
                    <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13, color: '#C8956C', marginBottom: 6 }}>
                      {`// ${t.idealPartnerTitle}`}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#C8956C', lineHeight: 1.65 }}>
                      {portrait.idealPartnerPicture}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ ...innerBox, textAlign: 'center', padding: '24px 20px' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 15, color: '#C8956C', lineHeight: 1.5, opacity: 0.65 }}>
                  {t.stillGettingToKnow}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#C8956C', marginTop: 8, lineHeight: 1.6, opacity: 0.45 }}>
                  {t.patternsEmerge}
                </p>
              </div>
            )}

            {/* Privacy note */}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(16,16,16,0.35)', lineHeight: 1.6, textAlign: 'center', fontStyle: 'italic' }}>
              {t.privacyNote}
            </p>

            {/* Delete */}
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  width: '100%',
                  background: '#F2C8C8',
                  border: 'none',
                  borderRadius: 14,
                  padding: '15px 20px',
                  color: '#101010',
                  fontFamily: 'var(--font-body)',
                  fontSize: 15,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {t.deleteData}
              </button>
            ) : (
              <div style={{ background: '#F2C8C8', borderRadius: 14, padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#101010' }}>{t.deleteConfirm}</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={handleDelete}
                    style={{ flex: 1, background: 'rgba(180,60,60,0.18)', border: '1px solid rgba(180,60,60,0.35)', borderRadius: 10, padding: '10px', color: '#c0392b', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                  >
                    {t.deleteYes}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(200,149,108,0.28)', borderRadius: 10, padding: '10px', color: '#101010', fontFamily: 'var(--font-body)', fontSize: 13, cursor: 'pointer' }}
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
    </div>
  )
}

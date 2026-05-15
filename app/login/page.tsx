'use client'

import { useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

type State = 'input' | 'sending' | 'sent' | 'error'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('input')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setState('sending')
    setErrorMsg('')

    const supabase = getSupabaseBrowser()
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    })

    if (error) {
      setErrorMsg(error.message)
      setState('error')
    } else {
      setState('sent')
    }
  }

  return (
    <div className="welcome-root animate-fade-in">
      {/* Top bar */}
      <div style={{ height: 56, padding: '0 20px', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.01em', fontWeight: 400 }}>
          {'{Mia: a girlfriend helps you date and love yourself }'}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px 40px' }}>
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 'clamp(24px, 4vw, 40px)',
          maxWidth: 400,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}>
          {state !== 'sent' ? (
            <>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(22px, 2.8vw, 28px)', fontWeight: 700, color: '#101010', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: 8 }}>
                  welcome back
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 300, color: 'rgba(0,0,0,0.45)', lineHeight: 1.6 }}>
                  enter your email and we'll send you a magic link to sign in.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                  style={{
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
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.35)' }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(0,0,0,0.12)' }}
                />
                {state === 'error' && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: '#c0392b', textAlign: 'center' }}>{errorMsg}</p>
                )}
                <button
                  type="submit"
                  disabled={state === 'sending' || !email.trim()}
                  style={{
                    width: '100%',
                    background: '#101010',
                    border: 'none',
                    borderRadius: 8,
                    padding: '13px 14px',
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: '#fff',
                    cursor: state === 'sending' ? 'not-allowed' : 'pointer',
                    opacity: state === 'sending' || !email.trim() ? 0.45 : 1,
                    transition: 'opacity 160ms',
                  }}
                >
                  {state === 'sending' ? 'sending...' : 'send magic link →'}
                </button>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 0' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, fontWeight: 700, color: '#101010', letterSpacing: '-0.02em' }}>
                check your email
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 300, color: 'rgba(0,0,0,0.50)', lineHeight: 1.6 }}>
                we sent a magic link to <strong style={{ fontWeight: 500, color: 'rgba(0,0,0,0.70)' }}>{email}</strong>. click it to sign in.
              </p>
              <button
                onClick={() => { setState('input'); setEmail('') }}
                style={{ background: 'none', border: 'none', fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(0,0,0,0.30)', cursor: 'pointer', marginTop: 4 }}
              >
                use a different email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

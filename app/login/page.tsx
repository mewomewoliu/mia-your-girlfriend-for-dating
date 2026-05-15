'use client'

import { useState } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/browser'

type State = 'input' | 'sending' | 'sent' | 'error'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<State>('input')
  const [errorMsg, setErrorMsg] = useState('')
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    const supabase = getSupabaseBrowser()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

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
                  sign in to continue with Mia.
                </p>
              </div>

              {/* Google button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                style={{
                  width: '100%',
                  background: '#fff',
                  border: '1px solid rgba(0,0,0,0.14)',
                  borderRadius: 8,
                  padding: '12px 14px',
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'rgba(0,0,0,0.70)',
                  cursor: googleLoading ? 'not-allowed' : 'pointer',
                  opacity: googleLoading ? 0.55 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  transition: 'border-color 150ms, opacity 150ms',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => { if (!googleLoading) (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.28)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.14)' }}
              >
                <GoogleIcon />
                {googleLoading ? 'redirecting...' : 'continue with Google'}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(0,0,0,0.30)', letterSpacing: '0.04em' }}>or</span>
                <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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

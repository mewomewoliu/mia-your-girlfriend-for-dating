'use client'

export function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10" aria-hidden>
      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />

      {/* Dark overlay so text remains legible */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(12,8,6,0.52)',
      }} />
    </div>
  )
}

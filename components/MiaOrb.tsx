'use client'

interface MiaOrbProps {
  size?: number
  className?: string
}

export function MiaOrb({ size = 42, className = '' }: MiaOrbProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 38% 38%, rgba(220,175,130,0.55) 0%, rgba(100,60,25,0.72) 50%, rgba(26,14,8,0.88) 100%)`,
        border: '1px solid rgba(200,149,108,0.30)',
        boxShadow: '0 0 20px rgba(200,149,108,0.20), 0 0 40px rgba(200,149,108,0.08)',
        animation: 'orb-breathe 4s ease-in-out infinite',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: size * 0.38,
          color: '#e8ede9',
          lineHeight: 1,
          userSelect: 'none',
          letterSpacing: '-0.01em',
        }}
      >
        M✦
      </span>
    </div>
  )
}

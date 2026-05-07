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
        background: `radial-gradient(circle at 38% 38%, rgba(138,171,143,0.55) 0%, rgba(42,92,82,0.72) 50%, rgba(8,12,9,0.85) 100%)`,
        border: '1px solid rgba(107,158,126,0.3)',
        boxShadow: '0 0 20px rgba(107,158,126,0.2), 0 0 40px rgba(107,158,126,0.08)',
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

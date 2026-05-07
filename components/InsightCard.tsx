'use client'

interface InsightCardProps {
  text: string
}

export function InsightCard({ text }: InsightCardProps) {
  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '0.5px solid rgba(200,149,108,0.28)',
        borderRadius: 12,
        padding: '10px 12px',
        marginTop: 6,
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 9,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '1.2px',
          color: 'var(--gold)',
          marginBottom: 5,
        }}
      >
        ✦ mia noticed
      </p>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          fontWeight: 300,
          color: 'var(--text-card-secondary)',
          lineHeight: 1.55,
        }}
      >
        {text}
      </p>
    </div>
  )
}

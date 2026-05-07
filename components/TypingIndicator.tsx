'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 animate-bubble-in">
      <div
        style={{
          background: 'var(--card-bg)',
          border: '0.5px solid rgba(200,149,108,0.20)',
          borderRadius: '20px 20px 20px 4px',
          padding: '12px 16px',
          display: 'flex',
          gap: 5,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--gold)',
              display: 'block',
              animation: `typing 1.4s ease-in-out infinite`,
              animationDelay: `${i * 0.22}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

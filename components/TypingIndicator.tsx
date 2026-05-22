'use client'

export function TypingIndicator() {
  return (
    <div className="flex items-start animate-bubble-in">
      <div
        style={{
          background: '#EDE8DF',
          borderRadius: '18px 18px 18px 4px',
          padding: '11px 16px',
          display: 'flex',
          gap: 5,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: 'rgba(16,16,16,0.30)',
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

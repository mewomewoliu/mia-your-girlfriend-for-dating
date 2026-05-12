'use client'

interface QuickReplyProps {
  options: string[]
  onSelect: (option: string) => void
}

export function QuickReply({ options, onSelect }: QuickReplyProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-2 animate-fade-in">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onSelect(opt)}
          style={{
            background: 'transparent',
            border: '1px solid rgba(0,0,0,0.14)',
            borderRadius: 20,
            padding: '6px 13px',
            color: 'rgba(16,16,16,0.60)',
            fontFamily: 'var(--font-body)',
            fontSize: 12.5,
            fontWeight: 400,
            cursor: 'pointer',
            transition: 'all 140ms ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(0,0,0,0.04)'
            el.style.borderColor = 'rgba(0,0,0,0.28)'
            el.style.color = 'rgba(16,16,16,0.80)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'transparent'
            el.style.borderColor = 'rgba(0,0,0,0.14)'
            el.style.color = 'rgba(16,16,16,0.60)'
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

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
            background: 'rgba(245,239,232,0.08)',
            border: '1px solid rgba(200,149,108,0.35)',
            borderRadius: 22,
            padding: '7px 14px',
            color: 'rgba(245,239,232,0.75)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 400,
            cursor: 'pointer',
            transition: 'all 160ms ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(245,239,232,0.14)'
            el.style.borderColor = 'rgba(200,149,108,0.60)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement
            el.style.background = 'rgba(245,239,232,0.08)'
            el.style.borderColor = 'rgba(200,149,108,0.35)'
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

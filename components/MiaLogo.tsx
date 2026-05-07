'use client'

interface MiaLogoProps {
  size?: number
}

export function MiaLogo({ size = 36 }: MiaLogoProps) {
  const h = size
  const bar = Math.round(size * 0.28)
  const gap = Math.round(size * 0.12)
  const r = bar / 2

  const heights = [0.55, 0.9, 1.0, 0.7]
  const totalW = heights.length * bar + (heights.length - 1) * gap

  return (
    <svg
      width={totalW}
      height={h}
      viewBox={`0 0 ${totalW} ${h}`}
      fill="none"
      aria-label="Mia"
    >
      {heights.map((frac, i) => {
        const bh = Math.round(h * frac)
        const x = i * (bar + gap)
        const y = h - bh
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={bar}
            height={bh}
            rx={r}
            fill="#C8956C"
          />
        )
      })}
    </svg>
  )
}

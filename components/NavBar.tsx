'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'

export function NavBar() {
  const path = usePathname()
  const { t } = useLanguage()

  const TABS = [
    { href: '/chat', label: t.navChat, icon: ChatIcon },
    { href: '/compatibility', label: t.navCompatibility, icon: CompatibilityIcon },
    { href: '/portrait', label: t.navPortrait, icon: PortraitIcon },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex items-center justify-around z-50"
      style={{
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(0,0,0,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        height: '58px',
      }}
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const active = path === href
        return (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center gap-0.5 px-6 py-2 transition-opacity"
            style={{ opacity: active ? 1 : 0.28 }}
          >
            <Icon size={20} color="#101010" />
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 9,
                color: '#101010',
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
              }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

function ChatIcon({ size = 20, color = '#101010' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CompatibilityIcon({ size = 20, color = '#101010' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="12" r="4" stroke={color} strokeWidth="1.5" />
      <circle cx="15" cy="12" r="4" stroke={color} strokeWidth="1.5" />
    </svg>
  )
}

function PortraitIcon({ size = 20, color = '#101010' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3" stroke={color} strokeWidth="1.5" />
      <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

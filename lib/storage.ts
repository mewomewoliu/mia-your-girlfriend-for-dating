'use client'

import type { UserProfile, Message, PortraitData, CompatibilityReport } from './types'

const KEYS = {
  profile: 'mia_profile',
  messages: 'mia_messages',
  portrait: 'mia_portrait',
  compatibility: 'mia_compatibility',
  language: 'mia_language',
} as const

function get<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function set(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  getProfile: () => get<UserProfile>(KEYS.profile),
  setProfile: (p: UserProfile) => set(KEYS.profile, p),

  getMessages: () => get<Message[]>(KEYS.messages) ?? [],
  setMessages: (m: Message[]) => set(KEYS.messages, m),

  getPortrait: () => get<PortraitData>(KEYS.portrait),
  setPortrait: (p: PortraitData) => set(KEYS.portrait, p),

  getCompatibility: () => get<CompatibilityReport[]>(KEYS.compatibility) ?? [],
  addCompatibility: (r: CompatibilityReport) => {
    const existing = get<CompatibilityReport[]>(KEYS.compatibility) ?? []
    set(KEYS.compatibility, [r, ...existing])
  },

  getLanguage: (): 'en' | 'zh' => {
    if (typeof window === 'undefined') return 'en'
    return (localStorage.getItem(KEYS.language) as 'en' | 'zh') ?? 'en'
  },
  setLanguage: (lang: 'en' | 'zh') => {
    if (typeof window === 'undefined') return
    localStorage.setItem(KEYS.language, lang)
  },

  clearAll: () => {
    if (typeof window === 'undefined') return
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k))
  },
}

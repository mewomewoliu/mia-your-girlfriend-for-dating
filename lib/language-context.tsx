'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getSupabaseBrowser } from './supabase/browser'
import { getProfile } from './db'
import { translations, type Lang, type Translations } from './i18n'

interface LanguageContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const profile = await getProfile(supabase, user.id)
      if (profile?.language === 'zh' || profile?.language === 'en') {
        setLangState(profile.language)
      }
    })
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { storage } from './storage'
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
    setLangState(storage.getLanguage())
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    storage.setLanguage(l)
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

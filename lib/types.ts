export interface BirthData {
  date: string       // YYYY-MM-DD
  time?: string      // HH:MM
  city: string
}

export interface Intentions {
  wantInLove: string
  repeatingPattern: string
  feelingSafe: string
}

export interface ChartData {
  dominantElement: string
  sunSign: string
  chineseZodiac: string
  baziStem: string
  insights: string[]
  summary: string
}

export interface UserProfile {
  name?: string
  birth: BirthData
  intentions: Intentions
  chart?: ChartData
  onboardingComplete: boolean
  createdAt: string
  language?: 'en' | 'zh'
}

export interface InsightCardData {
  text: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  insightCard?: InsightCardData
}

export interface PortraitData {
  patterns: string[]
  values: string[]
  energisers: string[]
  idealPartnerPicture: string
  updatedAt: string
}

export interface CompatibilityPartner {
  name: string
  birthDate: string
  birthTime?: string
  birthCity?: string
}

export interface CompatibilityReport {
  partnerName: string
  generatedAt: string
  sections: {
    wiredDifferently: string
    naturalAlignment: string
    payAttention: string
    chemistryVsLongevity: string
    questionsToExplore: string[]
  }
}

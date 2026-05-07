import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { buildCompatibilityPrompt } from '@/lib/mia-prompt'
import { deriveRawChart } from '@/lib/chart'
import type { UserProfile, CompatibilityReport } from '@/lib/types'

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { profile, partnerName, partnerBirthDate, partnerBirthTime, partnerBirthCity, language } =
      (await req.json()) as {
        profile: UserProfile
        partnerName: string
        partnerBirthDate: string
        partnerBirthTime?: string
        partnerBirthCity?: string
        language?: 'en' | 'zh'
      }

    const [py, pm, pd] = partnerBirthDate.split('-').map(Number)
    const partnerRaw = deriveRawChart({ year: py, month: pm, day: pd })
    const partnerInfo = `${partnerRaw.sunSign} sun, ${partnerRaw.chineseZodiac} zodiac, ${partnerRaw.yearElement} element`

    const prompt = buildCompatibilityPrompt(
      profile,
      partnerName,
      `${partnerBirthDate} (${partnerInfo})`,
      partnerBirthTime,
      partnerBirthCity,
      profile.chart?.summary ?? 'chart not available',
      language ?? 'en'
    )

    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    const extractSection = (label: string, next: string): string => {
      const start = text.indexOf(label)
      if (start === -1) return ''
      const end = next ? text.indexOf(next, start) : text.length
      return text.slice(start + label.length, end === -1 ? text.length : end).trim()
    }

    const rawQuestions = extractSection('SECTION_QUESTIONS:', '')
    const questions = rawQuestions
      .split('\n')
      .filter((l) => l.trim().startsWith('-'))
      .map((l) => l.replace(/^-\s*/, '').trim())
      .filter(Boolean)
      .slice(0, 3)

    const report: CompatibilityReport = {
      partnerName,
      generatedAt: new Date().toISOString(),
      sections: {
        wiredDifferently: extractSection('SECTION_WIRED_DIFFERENTLY:', 'SECTION_NATURAL_ALIGNMENT:'),
        naturalAlignment: extractSection('SECTION_NATURAL_ALIGNMENT:', 'SECTION_PAY_ATTENTION:'),
        payAttention: extractSection('SECTION_PAY_ATTENTION:', 'SECTION_CHEMISTRY_LONGEVITY:'),
        chemistryVsLongevity: extractSection('SECTION_CHEMISTRY_LONGEVITY:', 'SECTION_QUESTIONS:'),
        questionsToExplore: questions.length > 0 ? questions : [
          'how does he handle situations where he\'s wrong?',
          'have you seen him under real pressure yet?',
          'does he make it easy for you to be exactly who you are?',
        ],
      },
    }

    return NextResponse.json(report)
  } catch (err) {
    console.error('Compatibility API error:', err)
    return NextResponse.json({ error: 'Compatibility generation failed' }, { status: 500 })
  }
}

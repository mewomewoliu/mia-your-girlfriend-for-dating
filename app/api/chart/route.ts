import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { deriveRawChart } from '@/lib/chart'
import type { ChartData } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const client = new Anthropic()
    const { birthDate, birthTime, birthCity, intentions, language } = await req.json()
    const lang: 'en' | 'zh' = language ?? 'en'

    const [year, month, day] = birthDate.split('-').map(Number)
    const hour = birthTime ? parseInt(birthTime.split(':')[0]) : undefined
    const raw = deriveRawChart({ year, month, day, hour, city: birthCity })

    const prompt = `Generate a warm, personal chart reading for someone born on ${birthDate}${birthTime ? ` at ${birthTime}` : ''} in ${birthCity}.

Their raw chart data:
- Sun Sign (Western): ${raw.sunSign}
- Chinese Zodiac: ${raw.chineseZodiac}
- Bazi Year Heavenly Stem: ${raw.yearStem} (${raw.yearElement} element)
- Birth Year Branch: ${raw.yearBranch}

What they want in love: "${intentions.wantInLove}"
Pattern they want to understand: "${intentions.repeatingPattern}"

Return a JSON object with exactly these fields:
{
  "dominantElement": "one of: Wood, Fire, Earth, Metal, Water",
  "sunSign": "${raw.sunSign}",
  "chineseZodiac": "${raw.chineseZodiac}",
  "baziStem": "${raw.yearStem} (${raw.yearElement})",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "summary": "2-3 sentence narrative summary of their chart, lowercase, warm, personal"
}

Rules:
- insights array: exactly 3 items. Each 1-2 sentences. Lowercase. Personal, not generic. Connect their element to love patterns.
- summary: warm, like telling a friend what you see. Lowercase.
- dominant element: derive from the Bazi year element primarily
- No preamble. Return only the JSON object.${lang === 'zh' ? '\n\nIMPORTANT: Return ALL text values in Simplified Chinese: dominantElement (use one of: 木/火/土/金/水), sunSign (e.g. 白羊座), chineseZodiac (e.g. 龙), insights (in Chinese), summary (in Chinese).' : ''}`

    const response = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const chartData: ChartData = jsonMatch ? JSON.parse(jsonMatch[0]) : {
      dominantElement: raw.yearElement,
      sunSign: raw.sunSign,
      chineseZodiac: raw.chineseZodiac,
      baziStem: `${raw.yearStem} (${raw.yearElement})`,
      insights: [
        `your ${raw.yearElement} energy shapes how you connect — deeply and with great intensity.`,
        `as a ${raw.sunSign}, you lead with your heart before your head in love.`,
        `the ${raw.chineseZodiac} in you is loyal, intuitive, and sometimes your own hardest critic.`,
      ],
      summary: `your chart tells a story of someone who feels things deeply and loves with real intention. there's a lot of wisdom here — let's explore it together.`,
    }

    return NextResponse.json(chartData)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Chart API error:', msg)
    return NextResponse.json({ error: 'Chart generation failed', debug: msg }, { status: 500 })
  }
}

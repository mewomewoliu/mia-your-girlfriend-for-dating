import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { buildMiaSystemPrompt } from '@/lib/mia-prompt'
import { getSupabaseServer } from '@/lib/supabase/server'
import type { UserProfile, PortraitData } from '@/lib/types'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  const supabase = getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const client = new Anthropic()
    const { messages, profile, portrait, language, compatibilityContext } = (await req.json()) as {
      messages: { role: 'user' | 'assistant'; content: string }[]
      profile: UserProfile | null
      portrait: PortraitData | null
      language?: 'en' | 'zh'
      compatibilityContext?: {
        partnerName: string
        sections: { wiredDifferently: string; naturalAlignment: string; payAttention: string; chemistryVsLongevity: string }
      } | null
    }

    const systemPrompt = buildMiaSystemPrompt(profile, portrait, language ?? 'en', compatibilityContext)

    const stream = await client.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 600,
      system: systemPrompt,
      messages,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    console.error('Chat API error:', err)
    return new Response(
      "i'm having a moment — could you try again?",
      { status: 500, headers: { 'Content-Type': 'text/plain' } }
    )
  }
}

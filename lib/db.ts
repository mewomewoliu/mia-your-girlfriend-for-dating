import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserProfile, Message, PortraitData, CompatibilityReport } from './types'

// ── PROFILE ───────────────────────────────────────────────────────────────────

export async function getProfile(supabase: SupabaseClient, userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error || !data) return null
  return {
    name: data.name ?? undefined,
    birth: {
      date: data.birth_date,
      time: data.birth_time ?? undefined,
      city: data.birth_city,
    },
    intentions: data.intentions as UserProfile['intentions'],
    chart: data.chart as UserProfile['chart'] ?? undefined,
    onboardingComplete: data.onboarding_complete,
    createdAt: data.created_at,
    language: data.language as 'en' | 'zh',
  }
}

export async function setProfile(supabase: SupabaseClient, userId: string, profile: UserProfile): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      name: profile.name ?? null,
      birth_date: profile.birth.date,
      birth_time: profile.birth.time ?? null,
      birth_city: profile.birth.city,
      intentions: profile.intentions,
      chart: profile.chart ?? null,
      language: profile.language ?? 'en',
      onboarding_complete: profile.onboardingComplete,
      updated_at: new Date().toISOString(),
    })
  if (error) throw error
}

// ── MESSAGES ──────────────────────────────────────────────────────────────────

export async function getMessages(supabase: SupabaseClient, userId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error || !data) return []
  return data.map((row) => ({
    id: row.id,
    role: row.role as 'user' | 'assistant',
    content: row.content,
    timestamp: row.created_at,
    insightCard: row.insight_card ?? undefined,
  }))
}

export async function appendMessage(supabase: SupabaseClient, userId: string, message: Message): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .insert({
      id: message.id,
      user_id: userId,
      role: message.role,
      content: message.content,
      insight_card: message.insightCard ?? null,
      created_at: message.timestamp,
    })
  if (error) throw error
}

// ── PORTRAIT ──────────────────────────────────────────────────────────────────

export async function getPortrait(supabase: SupabaseClient, userId: string): Promise<PortraitData | null> {
  const { data, error } = await supabase
    .from('portraits')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error || !data) return null
  return {
    patterns: data.patterns ?? [],
    values: data.values ?? [],
    energisers: data.energisers ?? [],
    idealPartnerPicture: data.ideal_partner_picture ?? '',
    updatedAt: data.updated_at,
  }
}

export async function setPortrait(supabase: SupabaseClient, userId: string, portrait: PortraitData): Promise<void> {
  const { error } = await supabase
    .from('portraits')
    .upsert({
      user_id: userId,
      patterns: portrait.patterns,
      values: portrait.values,
      energisers: portrait.energisers,
      ideal_partner_picture: portrait.idealPartnerPicture,
      updated_at: portrait.updatedAt,
    })
  if (error) throw error
}

// ── COMPATIBILITY ─────────────────────────────────────────────────────────────

export async function getCompatibility(supabase: SupabaseClient, userId: string): Promise<CompatibilityReport[]> {
  const { data, error } = await supabase
    .from('compatibility_reports')
    .select('*')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false })
  if (error || !data) return []
  return data.map((row) => ({
    partnerName: row.partner_name,
    generatedAt: row.generated_at,
    sections: row.sections as CompatibilityReport['sections'],
  }))
}

export async function addCompatibility(supabase: SupabaseClient, userId: string, report: CompatibilityReport): Promise<void> {
  const { error } = await supabase
    .from('compatibility_reports')
    .insert({
      user_id: userId,
      partner_name: report.partnerName,
      sections: report.sections,
      generated_at: report.generatedAt,
    })
  if (error) throw error
}

// ── ACCOUNT ───────────────────────────────────────────────────────────────────

export async function deleteAccount(supabase: SupabaseClient, userId: string): Promise<void> {
  await supabase.from('profiles').delete().eq('id', userId)
  // cascade deletes messages, portraits, compatibility_reports via FK
  await supabase.auth.signOut()
}

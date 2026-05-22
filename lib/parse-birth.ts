// Accepts YYYY-MM-DD, DD-MM-YYYY (dashes/slashes), or MM DD YYYY (spaces)
// Returns normalized YYYY-MM-DD or null if unparseable
export function parseBirthDate(input: string): string | null {
  const s = input.trim()
  if (!s) return null

  let parts: string[]
  let sep: 'dash' | 'slash' | 'space'

  if (s.includes('-')) {
    parts = s.split('-').map((p) => p.trim()).filter(Boolean)
    sep = 'dash'
  } else if (s.includes('/')) {
    parts = s.split('/').map((p) => p.trim()).filter(Boolean)
    sep = 'slash'
  } else {
    parts = s.split(/\s+/).filter(Boolean)
    sep = 'space'
  }

  if (parts.length !== 3) return null

  let year: number, month: number, day: number

  if (parts[0].length === 4) {
    // YYYY-MM-DD
    year = Number(parts[0]); month = Number(parts[1]); day = Number(parts[2])
  } else if (parts[2].length === 4) {
    year = Number(parts[2])
    if (sep === 'space') {
      // MM DD YYYY
      month = Number(parts[0]); day = Number(parts[1])
    } else {
      // DD-MM-YYYY
      day = Number(parts[0]); month = Number(parts[1])
    }
  } else {
    return null
  }

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return null
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// Accepts HH:MM (24h). Returns normalized HH:MM or undefined.
export function parseBirthTime(input: string | undefined): string | undefined {
  if (!input) return undefined
  const match = input.trim().match(/^(\d{1,2})[:\s](\d{2})/)
  if (!match) return undefined
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) return undefined
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

// Normalizes spacing around commas; accepts "City Country" or "City, Country"
export function parseLocation(input: string): string {
  return input.trim().replace(/\s*,\s*/g, ', ').replace(/\s{2,}/g, ' ')
}

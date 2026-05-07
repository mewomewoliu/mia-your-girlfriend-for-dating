// Basic chart data derivation — passed to Claude for interpretation

const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const STEM_ELEMENTS = ['Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water']
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
const CHINESE_ZODIAC = ['Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig']

const WESTERN_SIGNS: [string, [number, number]][] = [
  ['Capricorn', [1, 1]],
  ['Aquarius', [1, 20]],
  ['Pisces', [2, 19]],
  ['Aries', [3, 21]],
  ['Taurus', [4, 20]],
  ['Gemini', [5, 21]],
  ['Cancer', [6, 21]],
  ['Leo', [7, 23]],
  ['Virgo', [8, 23]],
  ['Libra', [9, 23]],
  ['Scorpio', [10, 23]],
  ['Sagittarius', [11, 22]],
  ['Capricorn', [12, 22]],
]

function getSunSign(month: number, day: number): string {
  for (let i = WESTERN_SIGNS.length - 1; i >= 0; i--) {
    const [sign, [m, d]] = WESTERN_SIGNS[i]
    if (month > m || (month === m && day >= d)) return sign
  }
  return 'Capricorn'
}

function getYearStem(year: number): string {
  return HEAVENLY_STEMS[(year - 4) % 10]
}

function getYearElement(year: number): string {
  return STEM_ELEMENTS[(year - 4) % 10]
}

function getChineseZodiac(year: number): string {
  return CHINESE_ZODIAC[(year - 4) % 12]
}

export interface RawChartInputs {
  year: number
  month: number
  day: number
  hour?: number
  city?: string
}

export function deriveRawChart(inputs: RawChartInputs) {
  const { year, month, day } = inputs
  return {
    yearStem: getYearStem(year),
    yearElement: getYearElement(year),
    chineseZodiac: getChineseZodiac(year),
    sunSign: getSunSign(month, day),
    yearBranch: EARTHLY_BRANCHES[(year - 4) % 12],
    birthYear: year,
    birthMonth: month,
    birthDay: day,
  }
}

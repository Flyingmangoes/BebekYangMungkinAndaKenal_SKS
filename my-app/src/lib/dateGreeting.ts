const DAY_NAMES = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
] as const

const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const

export function formatDateId(date: Date): string {
  const dayName = DAY_NAMES[date.getDay()] ?? ''
  const monthName = MONTH_NAMES[date.getMonth()] ?? ''

  return `${dayName}, ${date.getDate()} ${monthName}`
}

export function getGreeting(date: Date): string {
  const hour = date.getHours()

  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

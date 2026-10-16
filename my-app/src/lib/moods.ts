export type MoodId = 'tenang' | 'baik' | 'berat' | 'overwhelmed' | 'capek'

export interface MoodOption {
  id: MoodId
  emoji: string
  label: string
  hint: string
}

export const MOOD_OPTIONS: readonly MoodOption[] = [
  { id: 'tenang', emoji: '🌿', label: 'Tenang', hint: 'Napas terasa longgar' },
  { id: 'baik', emoji: '⛅', label: 'Baik-baik saja', hint: 'Cukup berenergi' },
  { id: 'berat', emoji: '🍂', label: 'Agak berat', hint: 'Pikiran bercabang' },
  { id: 'overwhelmed', emoji: '🌊', label: 'Overwhelmed', hint: 'Sensori berlebih' },
  { id: 'capek', emoji: '🪫', label: 'Capek banget', hint: 'Baterai tinggal 5%' },
]

import type { LucideIcon } from 'lucide-react'
import { BellRing, Fingerprint, Heart, MoonStar, Share2, Sparkles, Sun } from 'lucide-react'

export interface SettingItem {
  id: string
  icon: LucideIcon
  title: string
  description: string
  defaultEnabled: boolean
}

export interface SettingGroup {
  id: string
  title: string
  items: readonly SettingItem[]
}

export interface BadgeItem {
  id: string
  icon: LucideIcon
  title: string
  description: string
}

export const SETTING_GROUPS: readonly SettingGroup[] = [
  {
    id: 'jadwal',
    title: 'Jadwal santai & pengingat',
    items: [
      {
        id: 'pagi',
        icon: Sun,
        title: 'Pengingat check-in pagi',
        description: 'Sapaan lembut sekitar jam 08.00, tanpa nada mendesak.',
        defaultEnabled: true,
      },
      {
        id: 'malam',
        icon: MoonStar,
        title: 'Jeda malam (wind down)',
        description: 'Ajakan rehat 30 menit sebelum waktu tidurmu.',
        defaultEnabled: true,
      },
      {
        id: 'notifikasi',
        icon: BellRing,
        title: 'Notifikasi hemat baterai',
        description: 'Maksimal satu pengingat per hari.',
        defaultEnabled: false,
      },
    ],
  },
  {
    id: 'privasi',
    title: 'Privasi tanpa khawatir',
    items: [
      {
        id: 'biometrik',
        icon: Fingerprint,
        title: 'Kunci biometrik',
        description: 'Minta sidik jari atau wajah saat membuka catatan.',
        defaultEnabled: false,
      },
      {
        id: 'rekap',
        icon: Share2,
        title: 'Bagikan rekap ke teman',
        description: 'Hanya jika kamu yang memulainya. Tidak ada yang dibagikan otomatis.',
        defaultEnabled: false,
      },
    ],
  },
]

export const BADGES: readonly BadgeItem[] = [
  { id: 'b1', icon: Heart, title: 'Penjaga Jeda', description: 'Mengambil 4 jeda singkat dalam sepekan' },
  { id: 'b2', icon: Sparkles, title: 'Tanpa Skor', description: 'Bertahan tanpa melihat angka' },
]

export const PROFILE_SUMMARY = {
  joinedLabel: 'Bergabung sejak Agustus',
  statements: [
    'Catatanmu hanya tersimpan di perangkat ini.',
    'Tidak ada streak yang bisa patah.',
  ],
}

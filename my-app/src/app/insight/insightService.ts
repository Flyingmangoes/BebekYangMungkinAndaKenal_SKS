import type { LucideIcon } from 'lucide-react'
import { BedDouble, Cloud, Leaf, Smile, Sprout, Sun, Waves } from 'lucide-react'

export type DayTone = 'calm' | 'heavy'

export interface WeekDay {
  id: string
  dateLabel: string
  icon: LucideIcon
  mood: string
  note: string
  tone: DayTone
}

export interface QuestFit {
  id: string
  label: string
  resultLabel: string
  value: number
  tone: 'pelan' | 'sand' | 'muted'
  note: string
}

export interface GoodThing {
  id: string
  title: string
  description: string
  isHighlighted: boolean
}

export type DisplayOptionId = 'hide-streak' | 'qualitative' | 'no-metrics'

export interface DisplayOption {
  id: DisplayOptionId
  label: string
}

export const INSIGHT_HEADER = {
  eyebrow: 'Refleksi rutin • Siklus 18 – 24 Oktober',
  title: 'Pola Mingguan Kamu',
  description:
    'Observasi sederhana dari cek emosi, micro-quest, dan catatan refleksi selama 7 hari terakhir (18 – 24 Okt).',
  badge: 'Tanpa skor diagnostik. Hanya pengingat tumbuh.',
}

export const MAIN_OBSERVATION = {
  label: 'Temuan observasi utama',
  quote:
    'Pola yang terlihat: Di hari Rabu & Kamis saat jadwal kuliah padat, energimu cenderung turun lebih cepat. Menariknya, kamu paling konsisten menyelesaikan quest rehat singkat di bawah 5 menit.',
  note: 'Ini bukan kelemahan, melainkan respons alami tubuhmu terhadap beban kerja kognitif di tengah pekan ini.',
}

export const WEEK_DAYS: readonly WeekDay[] = [
  { id: 'd1', dateLabel: 'Jum, 18', icon: Leaf, mood: 'Tenang', note: 'Cukup lega', tone: 'calm' },
  { id: 'd2', dateLabel: 'Sab, 19', icon: Smile, mood: 'Lega', note: 'Rehat jeda pelan', tone: 'calm' },
  { id: 'd3', dateLabel: 'Min, 20', icon: BedDouble, mood: 'Rehat Penuh', note: 'Menyendiri', tone: 'calm' },
  { id: 'd4', dateLabel: 'Sen, 21', icon: Sprout, mood: 'Tenang', note: 'Fokus pelan', tone: 'calm' },
  { id: 'd5', dateLabel: 'Sel, 22', icon: Sun, mood: 'Cukup Baik', note: 'Stabil', tone: 'calm' },
  { id: 'd6', dateLabel: 'Rab, 23', icon: Waves, mood: 'Overwhelmed', note: 'Tugas menumpuk', tone: 'heavy' },
  { id: 'd7', dateLabel: 'Kam, 24', icon: Cloud, mood: 'Agak Berat', note: 'Hari ini', tone: 'heavy' },
]

export const WEEK_NOTE =
  'Catatan: Mengakui rasa lelah di hari Kamis adalah tanda keterhubungan yang baik dengan sinyal tubuhmu.'

export const QUEST_FITS: readonly QuestFit[] = [
  {
    id: 'f1',
    label: 'Rehat Sensorik & Napas',
    resultLabel: '85% Nyaman',
    value: 85,
    tone: 'pelan',
    note: 'Paling sering kamu selesaikan saat sore hari tanpa rasa terbebani.',
  },
  {
    id: 'f2',
    label: 'Batas Digital Sejenak',
    resultLabel: '70% Diterima',
    value: 70,
    tone: 'sand',
    note: 'Cukup mudah dilakukan dengan membalikkan layar ponsel selama 15 menit.',
  },
  {
    id: 'f3',
    label: 'Refleksi Tertulis',
    resultLabel: '40% Sering di-skip',
    value: 40,
    tone: 'muted',
    note: 'Sering di-skip saat lelah, dan itu wajar. Menulis butuh energi kognitif ekstra.',
  },
]

export const QUEST_FIT_TIP =
  'Bila sedang lelah, format audio atau gestur fisik sederhana terasa jauh lebih ramah dibanding jurnal panjang.'

export const GOOD_THINGS: readonly GoodThing[] = [
  {
    id: 'g1',
    title: 'Kamu mengambil 4 jeda singkat minggu ini.',
    description: 'Memberi ruang untuk menghela napas di sela kesibukan kampus.',
    isHighlighted: true,
  },
  {
    id: 'g2',
    title: 'Kamu berani melewati quest saat tubuhmu butuh tidur lebih awal.',
    description:
      'Menolak tugas tanpa rasa bersalah untuk mendahulukan istirahat adalah sebuah kemampuan.',
    isHighlighted: false,
  },
]

export const ARCHIVE_QUOTE = {
  label: 'Arsip hening',
  quote: 'Tubuh punya jam biologisnya sendiri.',
  note: 'Dicatat pada hari Senin malam',
}

export const NEXT_WEEK_EXPERIMENT = {
  badge: 'Eksperimen santai',
  question: 'Gimana kalau kita coba quest rehat 2 menit di jam 4 sore sebelum rasa lelah menumpuk?',
  body: 'Berdasarkan ritmemu, jam 16:00 adalah titik peralihan saat fokus mulai buyar. Mengambil napas 120 detik sebelum pulang bisa melembutkan transisi menuju malam.',
}

export const DISPLAY_OPTIONS: readonly DisplayOption[] = [
  { id: 'hide-streak', label: 'Sembunyikan hitungan streak (Default)' },
  { id: 'qualitative', label: 'Hanya tampilkan refleksi kualitatif' },
  { id: 'no-metrics', label: 'Mode tanpa metrik (Halaman kosong tenang)' },
]

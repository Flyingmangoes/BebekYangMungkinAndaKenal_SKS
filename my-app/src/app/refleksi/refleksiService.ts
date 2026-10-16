import type { LucideIcon } from 'lucide-react'
import { BatteryLow, Clock, Waves, Moon } from 'lucide-react'

export type MessageAuthor = 'companion' | 'user'

export interface ChatMessage {
  id: string
  author: MessageAuthor
  text: string
  timeLabel: string
}

export interface QuickReply {
  id: string
  label: string
  isRest: boolean
}

export interface QuickJournalTile {
  id: string
  icon: LucideIcon
  label: string
  hint: string
}

export const COMPANION_INTRO = {
  name: 'Teman Refleksi SKS',
  badge: 'Pendengar Lembut',
  description:
    'Bukan psikolog atau dokter, melainkan ruang aman untuk mengurai benang kusut di kepalamu. Tidak ada tuntutan solusi cepat atau keharusan untuk positif.',
}

export const INITIAL_MESSAGES: readonly ChatMessage[] = [
  {
    id: 'm1',
    author: 'companion',
    text: 'Selamat sore, Nadia. Tadi kamu sempat menandai bahwa perasaanmu agak berat dan pikiran terasa penuh. Mau coba ceritakan sedikit apa yang paling menguras energimu hari ini?',
    timeLabel: '15:42',
  },
  {
    id: 'm2',
    author: 'user',
    text: 'Tugas akhir makin dekat dan rasanya semua orang di sekitarku udah punya arah yang jelas, sedangkan aku masih bingung mau mulai dari mana.',
    timeLabel: '16:44',
  },
  {
    id: 'm3',
    author: 'companion',
    text: 'Wajar banget kalau kamu merasa begitu. Tekanan membandingkan diri di masa transisi sering bikin kita merasa tertinggal. Kalau mau, kita pilah pelan-pelan: mana yang benar-benar mendesak, dan mana yang hanya terasa mendesak karena melihat langkah orang lain.',
    timeLabel: '16:45',
  },
]

export const QUICK_REPLIES: readonly QuickReply[] = [
  { id: 'r1', label: 'Takut salah mulai', isRest: false },
  { id: 'r2', label: 'Capek ekspektasi diri sendiri', isRest: false },
  { id: 'r3', label: 'Bingung teknisnya', isRest: false },
  { id: 'r4', label: 'Butuh rehat dulu', isRest: true },
]

export const QUICK_JOURNAL_TILES: readonly QuickJournalTile[] = [
  { id: 't1', icon: BatteryLow, label: 'Low energy', hint: 'Baterai sosial tipis' },
  { id: 't2', icon: Waves, label: 'Overwhelmed', hint: 'Terlalu banyak sekaligus' },
  { id: 't3', icon: Clock, label: 'Nggak sempat', hint: 'Hari terlalu cepat' },
  { id: 't4', icon: Moon, label: 'Butuh istirahat', hint: 'Izin rehat sejenak' },
]

export const SLOW_ESSAY = {
  tag: 'Esai lambat • 2 mnt',
  title: 'Berdamai dengan Perasaan “Tertinggal”',
  excerpt:
    'Di usia 20-an, ritme hidup bukan perlombaan lari cepat. Setiap bibit tumbuh di kedalaman tanah yang berbeda.',
  linkLabel: 'Baca refleksi ringkas',
}

export function buildCompanionReply(userText: string): string {
  const trimmed = userText.trim()

  if (trimmed.length === 0) {
    return 'Tidak apa-apa kalau belum ada kata-katanya. Aku di sini, dan kita bisa jeda sebentar.'
  }

  return 'Terima kasih sudah mau menuliskannya. Itu bukan hal kecil. Kalau kamu mau, ceritakan bagian yang paling terasa berat, atau kita berhenti dulu di sini. Dua-duanya sama-sama boleh.'
}

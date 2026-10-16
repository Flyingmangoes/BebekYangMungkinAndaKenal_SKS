import type { ArtworkVariant } from '@/components/ui/Artwork'

export const ALL_TOPICS = 'Semua Topik'

export const TOPICS: readonly string[] = [
  ALL_TOPICS,
  'Overthinking',
  'Burnout Kuliah/Kerja',
  'FOMO & Media Sosial',
  'Quarter-Life Uncertainty',
  'Boundaries & Hubungan',
  'Digital Fatigue',
]

export interface FeaturedArticle {
  topic: string
  readingTime: string
  reviewedBy: string
  title: string
  quote: string
  summaryTitle: string
  summaryPoints: readonly string[]
  badge: string
}

export interface Article {
  id: string
  topic: string
  readingTime: string
  subtitle: string
  title: string
  excerpt: string
  authorInitials: string
  authorName: string
  artwork: ArtworkVariant
}

export const EKSPLORASI_HEADER = {
  eyebrow: 'Ruang belajar mandiri • Edisi terkurasi',
  title: 'Menamai apa yang berkecamuk di dalam kepala.',
  description:
    'Esai psikoedukasi berbasis sains yang ditulis tanpa penghakiman. Dibuat untuk dibaca perlahan, ditemani secangkir teh hangat.',
  paceLabel: 'Tempo Santai',
  paceHint: 'Rata-rata 3-5 menit baca',
}

export const FEATURED_ARTICLE: FeaturedArticle = {
  topic: 'Overthinking',
  readingTime: '4 menit baca',
  reviewedBy: 'Ditulis bersama konselor psikologi tersertifikasi',
  title: 'Kenapa Otak Kita Sering Menuntut Segalanya Sempurna Sebelum Mulai?',
  quote:
    'Mengenal kaitan erat antara perfeksionisme yang tampak rapi dan prokrastinasi yang melelahkan pada mahasiswa & fresh graduate di Indonesia.',
  summaryTitle: 'Ringkasan inti yang akan kamu pahami:',
  summaryPoints: [
    'Prokrastinasi bukan tentang kemalasan, melainkan mekanisme perlindungan ego dari rasa takut akan ketidaksempurnaan.',
    'Konsep Good Enough Practice untuk menurunkan standar kritis yang melumpuhkan inisiatif.',
    'Satu latihan mikro 2 menit untuk mengambil tindakan sebelum rasa cemas mengambil alih.',
  ],
  badge: 'Kajian Pilihan Minggu Ini',
}

export const ARTICLES: readonly Article[] = [
  {
    id: 'a1',
    topic: 'FOMO & Media Sosial',
    readingTime: '3 menit baca',
    subtitle: 'Kajian Komparasi Sosial',
    title: 'FOMO di Instagram Stories: Kenapa Keberhasilan Teman Terasa Menekan Kita?',
    excerpt:
      'Bukan karena kamu iri atau jahat. Algoritma sosial dirancang untuk memamerkan sorotan terbaik orang lain di saat kamu sedang berada di titik terendah.',
    authorInitials: 'dr',
    authorName: 'dr. Aris S., Sp.KJ',
    artwork: 'cafe',
  },
  {
    id: 'a2',
    topic: 'Boundaries & Hubungan',
    readingTime: '5 menit baca',
    subtitle: 'Komunikasi Asertif',
    title: 'Cara Bilang “Nggak Dulu” ke Ajakan Teman Tanpa Merasa Bersalah',
    excerpt:
      'Kamus templat kalimat halus nan tegas untuk melindungi baterai sosialmu di akhir pekan, tanpa merusak pertemanan.',
    authorInitials: 'S',
    authorName: 'Siti Wardah, M.Psi',
    artwork: 'journal',
  },
  {
    id: 'a3',
    topic: 'Burnout Kuliah/Kerja',
    readingTime: '4 menit baca',
    subtitle: 'Kesehatan Somatik',
    title: 'Mengenali Burnout Sebelum Tubuhmu yang Memaksa Berhenti',
    excerpt:
      'Migrain di hari Minggu sore, tenggorokan tercekat, dan mati rasa emosional: bagaimana tubuh membisikkan sinyal bahaya sebelum jatuh sakit.',
    authorInitials: 'R',
    authorName: 'Rizky Darmawan, Psi.',
    artwork: 'plant',
  },
  {
    id: 'a4',
    topic: 'Digital Fatigue',
    readingTime: '3 menit baca',
    subtitle: 'Detoks Dopamin Ringan',
    title: 'Mindful Scrolling: Mengurangi Rasa Hampa Setelah Berjam-jam di TikTok',
    excerpt:
      'Protokol transisi 60 detik sebelum meletakkan gawai, memutus loop dopamin tanpa perlu mematikan smartphone seharian.',
    authorInitials: 'dr',
    authorName: 'dr. Aris S., Sp.KJ',
    artwork: 'window',
  },
]

export const AUDIO_MEDITATION = {
  label: 'Audio meditasi singkat',
  title: 'Melepaskan Ketegangan Leher & Rahang (3 Menit)',
  description: 'Dengarkan panduan suara lembut jika matamu terlalu lelah untuk membaca saat ini.',
}

export const SAFE_NOTICE = {
  label: 'Ruang aman & tanggung jawab klinis',
  body: 'Edukasi ini dibuat untuk membantumu memahami diri. Jika kamu butuh tempat konsultasi profesional berlisensi, akses direktori layanan psikolog resmi HIMPSI dan Sejiwa di sini.',
  hotlineNote: 'Hotline krisis darurat Kemenkes (Sejiwa 119 ext 8) selalu bebas pulsa dan aktif 24 jam.',
}

export const TOTAL_NOTES = 28

export function filterArticles(topic: string): readonly Article[] {
  if (topic === ALL_TOPICS) {
    return ARTICLES
  }

  return ARTICLES.filter((article) => article.topic === topic)
}

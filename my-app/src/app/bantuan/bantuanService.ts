export type HotlineAction = 'call' | 'link'

export interface Hotline {
  id: string
  name: string
  description: string
  displayNumber: string
  copyValue: string
  actionLabel: string
  actionType: HotlineAction
  href: string
  isPrimary: boolean
}

export interface OfficialService {
  id: string
  label: string
  title: string
  description: string
  linkLabel?: string
  href?: string
  note?: string
}

export interface MessageTemplate {
  id: string
  label: string
  text: string
}

export const BANTUAN_HEADER = {
  eyebrow: 'Ruang aman & dukungan terpercaya',
  title: 'Ruang Bantuan & Dukungan Profesional',
  description:
    'SKS adalah teman refleksi sehari-hari, bukan pengganti psikolog atau layanan medis. Jika perasaanmu terasa terlalu berat atau butuh pendampingan khusus, ini beberapa ruang aman yang bisa kamu hubungi.',
}

export const ACCESS_BANNER = {
  title: 'Tarif dan akses ramah kantong',
  description:
    'Layanan kesehatan jiwa di Puskesmas dapat diakses melalui BPJS Kesehatan dengan rujukan dari fasilitas kesehatan tingkat pertama.',
  linkLabel: 'Pelajari alur BPJS',
}

export const CRISIS_INTRO = {
  title: 'Dukungan Krisis & Hotline',
  badge: 'Siap 24 Jam',
  description:
    'Ketika dadamu terasa begitu sesak atau pikiranmu riuh tak tertahankan, orang-orang terlatih ini hadir untuk mendengarkan tanpa menghakimi.',
  emergencyNote: 'Jika kamu atau orang di dekatmu dalam bahaya langsung, hubungi layanan darurat 112.',
}

export const HOTLINES: readonly Hotline[] = [
  {
    id: 'sejiwa',
    name: 'Hotline SEJIWA (Kemenkes RI)',
    description: 'Layanan kesehatan jiwa darurat nasional',
    displayNumber: '119 ext 8',
    copyValue: '119 ext 8',
    actionLabel: 'Panggil Langsung',
    actionType: 'call',
    href: 'tel:119',
    isPrimary: true,
  },
  {
    id: 'halo-kemkes',
    name: 'Halo Kemkes',
    description: 'Informasi rujukan medis & kesehatan jiwa',
    displayNumber: '1500-567',
    copyValue: '1500567',
    actionLabel: 'Hubungi',
    actionType: 'call',
    href: 'tel:1500567',
    isPrimary: false,
  },
  {
    id: 'pulih',
    name: 'Yayasan Pulih',
    description: 'Pemulihan trauma & konseling psikososial',
    displayNumber: 'Situs resmi',
    copyValue: 'https://pulih.or.id',
    actionLabel: 'Buka Situs Pulih',
    actionType: 'link',
    href: 'https://pulih.or.id',
    isPrimary: false,
  },
]

export const SMALL_RHYTHM = {
  label: 'Ritme kecil',
  text: 'Napas dulu sejenak. Kamu berhak merasa aman sebelum memutuskan langkah berikutnya.',
}

export const OFFICIAL_INTRO = {
  title: 'Layanan Konseling & Terapi Resmi',
  badge: 'Terakreditasi',
  description:
    'Bimbingan profesional dapat membantu mengurai benang kusut yang sulit diurai sendiri. Berikut opsi legal, teruji secara etis, dan bersertifikasi di Indonesia:',
}

export const OFFICIAL_SERVICES: readonly OfficialService[] = [
  {
    id: 'himpsi',
    label: 'Direktori resmi',
    title: 'HIMPSI (Himpunan Psikologi Indonesia)',
    description: 'Basis data psikolog klinis tersertifikasi SIPP aktif di seluruh provinsi Indonesia.',
    linkLabel: 'Cari Psikolog Terdekat',
    href: 'https://himpsi.or.id',
  },
  {
    id: 'tele',
    label: 'Tele-konseling online',
    title: 'Platform Konseling Berizin',
    description: 'Akses tetap nyaman dari rumah lewat platform konseling daring yang berizin.',
    note: 'Chat, telepon, atau video call privat',
  },
]

export const PUSKESMAS = {
  title: 'Puskesmas Ramah Remaja & BPJS Kesehatan',
  description:
    'Banyak Puskesmas di kota dan kabupaten kini memiliki layanan psikologi atau kesehatan jiwa. Caranya: datang ke fasilitas kesehatan tingkat pertama (Faskes 1) yang terdaftar, minta rujukan bila diperlukan, dan ceritakan keluhan awalmu secara apa adanya.',
}

export const FIRST_SESSION_TIPS: readonly string[] = [
  'Tulis 2–3 hal yang paling mengganggumu belakangan ini.',
  'Tidak perlu rapi. Boleh bilang “aku bingung mulai dari mana”.',
  'Boleh bertanya soal proses, privasi, dan biaya di awal sesi.',
]

export const TEMPLATES_INTRO = {
  title: 'Membuka Cerita ke Orang Terdekat',
  description:
    'Terkadang yang paling sulit bukanlah menghadapi masalah itu sendiri, melainkan memecah keheningan pertama kali. Berikut template kalimat lembut yang bisa kamu salin atau sesuaikan saat mengirim pesan ke sahabat atau keluarga:',
}

export const MESSAGE_TEMPLATES: readonly MessageTemplate[] = [
  {
    id: 'sahabat',
    label: 'Opsi 1: Untuk sahabat (tanpa menuntut solusi)',
    text: 'Hai, akhir-akhir ini kepalaku lagi agak penuh dan rasanya capek banget. Boleh nggak nanti kita ngopi atau telponan sebentar? Aku cuma lagi butuh teman duduk yang tenang.',
  },
  {
    id: 'pasangan',
    label: 'Opsi 2: Untuk pasangan atau saudara',
    text: 'Aku mau izin bilang kalau kondisiku beberapa hari ini lagi kurang oke secara mental. Kalau aku kelihatan pendiam atau menarik diri, ini bukan karena kamu ya. Aku lagi belajar pulih pelan-pelan.',
  },
]

export const CLOSING = {
  quote: 'Kamu tidak harus melewati semuanya sendirian. Meminta bantuan adalah bentuk keberanian, bukan kelemahan.',
  author: 'SKS • Ekosistem kesejahteraan jiwa Gen Z Indonesia',
}

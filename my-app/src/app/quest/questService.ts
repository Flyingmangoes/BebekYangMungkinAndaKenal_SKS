export type EnergyLevel = 'rendah' | 'sedang' | 'cukup'

export interface EnergyOption {
  id: EnergyLevel
  emoji: string
  label: string
  description: string
}

export interface QuestItem {
  id: string
  energy: EnergyLevel
  tag: string
  category: string
  minutesLabel: string
  title: string
  body: string
  timerLabel: string
  soundLabel: string
  estimatedTime: string
  pressureLabel: string
  mainCategory: string
}

export interface StepTrail {
  id: string
  day: string
  title: string
  note: string
  isDone: boolean
}

export interface PsychNote {
  tag: string
  readingTime: string
  title: string
  excerpt: string
}

export const ENERGY_OPTIONS: readonly EnergyOption[] = [
  {
    id: 'rendah',
    emoji: '🌱',
    label: 'Energi Rendah',
    description: 'Rehat & Napas. Beban nol untuk kepala yang sedang lelah.',
  },
  {
    id: 'sedang',
    emoji: '🌿',
    label: 'Energi Sedang',
    description: 'Batas Digital & Ruang. Menciptakan jarak dari dunia luar.',
  },
  {
    id: 'cukup',
    emoji: '🌳',
    label: 'Energi Cukup',
    description: 'Refleksi & Komunikasi. Sedikit mengurai pikiran ke luar.',
  },
]

const QUESTS: readonly QuestItem[] = [
  {
    id: 'q-rendah-1',
    energy: 'rendah',
    tag: 'Micro-Habit',
    category: 'Rehat Digital',
    minutesLabel: '10 menit santai',
    title: 'Matikan notifikasi selama 10 menit dan fokus ke satu hal di depanmu.',
    body: 'Bukan untuk produktivitas berlebihan, tapi untuk memberi jeda pada otakmu dari lonjakan dopamin dan kebisingan grup chat. Cukup letakkan layar menghadap ke bawah.',
    timerLabel: 'Jeda hening',
    soundLabel: 'Hujan Lembut',
    estimatedTime: '10 Menit',
    pressureLabel: 'Ringan',
    mainCategory: 'Boundary Setting',
  },
  {
    id: 'q-rendah-2',
    energy: 'rendah',
    tag: 'Rehat Sensorik',
    category: 'Napas',
    minutesLabel: '3 menit santai',
    title: 'Duduk diam sambil menggenggam gelas hangat dan rasakan suhunya.',
    body: 'Tidak perlu memikirkan apa pun. Cukup perhatikan uap, suhu, dan beratnya gelas di tanganmu selama tiga menit.',
    timerLabel: 'Jeda napas',
    soundLabel: 'Napas Perlahan',
    estimatedTime: '3 Menit',
    pressureLabel: 'Sangat ringan',
    mainCategory: 'Rehat Sensorik',
  },
  {
    id: 'q-sedang-1',
    energy: 'sedang',
    tag: 'Ruang Kecil',
    category: 'Batas Digital',
    minutesLabel: '5 menit santai',
    title: 'Rapikan satu sudut meja saja, lalu berhenti.',
    body: 'Satu sudut sudah cukup. Menciptakan ruang yang lebih lega di depan mata sering membantu kepala ikut lebih lega.',
    timerLabel: 'Rapikan sejenak',
    soundLabel: 'Kafe Pagi',
    estimatedTime: '5 Menit',
    pressureLabel: 'Ringan',
    mainCategory: 'Ruang & Lingkungan',
  },
  {
    id: 'q-sedang-2',
    energy: 'sedang',
    tag: 'Jalan Pelan',
    category: 'Gerak Ringan',
    minutesLabel: '8 menit santai',
    title: 'Jalan kaki tanpa earphone di sekitar tempatmu.',
    body: 'Dengarkan suara sekitar. Tidak ada target langkah, tidak ada tujuan. Pulang kapan pun kamu merasa cukup.',
    timerLabel: 'Jalan hening',
    soundLabel: 'Suara Sekitar',
    estimatedTime: '8 Menit',
    pressureLabel: 'Ringan',
    mainCategory: 'Gerak Ringan',
  },
  {
    id: 'q-cukup-1',
    energy: 'cukup',
    tag: 'Komunikasi',
    category: 'Refleksi Singkat',
    minutesLabel: '10 menit santai',
    title: 'Kirim satu pesan jujur ke teman dekat: “Aku lagi agak capek.”',
    body: 'Tidak perlu penjelasan panjang atau solusi. Cukup memberi tahu satu orang bahwa kamu sedang tidak sepenuhnya baik-baik saja.',
    timerLabel: 'Tulis pelan',
    soundLabel: 'Piano Lembut',
    estimatedTime: '10 Menit',
    pressureLabel: 'Sedang',
    mainCategory: 'Koneksi Sosial',
  },
  {
    id: 'q-cukup-2',
    energy: 'cukup',
    tag: 'Jurnal Mikro',
    category: 'Refleksi Tertulis',
    minutesLabel: '7 menit santai',
    title: 'Tulis tiga kalimat tentang hal yang paling menguras energimu hari ini.',
    body: 'Tidak perlu rapi atau bijak. Cukup keluarkan dari kepala ke layar, lalu tutup lagi kapan pun kamu mau.',
    timerLabel: 'Menulis santai',
    soundLabel: 'Hujan Lembut',
    estimatedTime: '7 Menit',
    pressureLabel: 'Ringan',
    mainCategory: 'Refleksi',
  },
]

export const STEP_TRAIL: readonly StepTrail[] = [
  {
    id: 's1',
    day: 'Kemarin',
    title: 'Duduk diam 2 menit',
    note: 'Tanpa mengecek pesan masuk',
    isDone: true,
  },
  {
    id: 's2',
    day: 'Selasa',
    title: 'Jalan kaki tanpa earphone',
    note: 'Mendengarkan suara sekitar kompleks',
    isDone: true,
  },
  {
    id: 's3',
    day: 'Senin',
    title: 'Istirahat total',
    note: 'Memilih tidur lebih awal saat lelah',
    isDone: false,
  },
]

export const PSYCH_NOTE: PsychNote = {
  tag: 'Catatan Psikososial',
  readingTime: '3 menit baca',
  title: 'Mengapa micro-quest 10 menit lebih menyembuhkan daripada target besar yang gagal?',
  excerpt:
    'Ketika amigdala berada dalam kelelahan kronis (burnout), tuntutan perbaikan diri yang masif justru memicu rasa bersalah baru. Langkah mikroskopis melewati alarm stres dan mengembalikan rasa kendali secara perlahan.',
}

export function getQuestsByEnergy(energy: EnergyLevel): readonly QuestItem[] {
  return QUESTS.filter((quest) => quest.energy === energy)
}

export interface QuestHighlight {
  tag: string
  durationLabel: string
  energyLabel: string
  questNumber: string
  title: string
  body: string
  note: string
}

export interface PatternInsight {
  periodLabel: string
  title: string
  quote: string
  chartLabel: string
  trendLabel: string
  chartValues: readonly number[]
  chartDays: readonly string[]
}

export interface ReadingHighlight {
  badge: string
  category: string
  readingTime: string
  title: string
  excerpt: string
  authorInitials: string
  authorLabel: string
}

export interface BerandaContent {
  heroBadge: string
  heroTitle: string
  heroDescription: string
  breathLabel: string
  breathValue: string
  quest: QuestHighlight
  pattern: PatternInsight
  reading: ReadingHighlight
  closingQuote: string
  closingAuthor: string
}

export function getBerandaContent(userName: string): BerandaContent {
  return {
    heroBadge: 'Ruang Tenang • Edisi Sore Hari',
    heroTitle: 'Bagaimana perasaanmu sore ini?',
    heroDescription: `Ambil waktu sejenak, ${userName}. Tidak ada tolok ukur, tidak ada yang perlu diburu-buru.`,
    breathLabel: 'Ritme bernapas',
    breathValue: 'Boleh melambat sekarang',
    quest: {
      tag: 'Rehat sejenak',
      durationLabel: '2 menit',
      energyLabel: 'Energi Rendah',
      questNumber: 'Quest #084',
      title: 'Taruh HP selama 2 menit dan nikmati secangkir air tanpa distraksi notifikasi.',
      body: 'Biarkan kedua tanganmu menggenggam gelas hangat atau dingin. Rasakan suhunya berpindah ke telapak tangan. Hanya dua menit tanpa tuntutan membalas pesan siapa pun.',
      note: 'Belum sempat hari ini? Nggak apa-apa, kamu bisa lanjut kapan saja tanpa merusak ritme apa pun.',
    },
    pattern: {
      periodLabel: '5 hari terakhir',
      title: 'Kelelahan sensori cenderung berkumpul di rentang pukul 16:00 - 18:00.',
      quote:
        'Dalam 5 hari terakhir, kamu cenderung merasa overwhelmed saat sore hari di tengah tugas kuliah yang padat. Kamu lebih nyaman dengan quest santai di bawah 5 menit.',
      chartLabel: 'Fluktuasi beban mental sore',
      trendLabel: 'Kian melandai',
      chartValues: [62, 70, 48, 55, 34],
      chartDays: ['Sen', 'Sel', 'Rab', 'Kam', 'Hari Ini'],
    },
    reading: {
      badge: 'Validasi Emosi',
      category: 'Overthinking & Rehat Mental',
      readingTime: '3 menit baca',
      title: 'Kenapa otak kita sering overthinking justru saat mau tidur?',
      excerpt:
        'Ketika distraksi dunia luar padam dan layar HP akhirnya gelap, ruang hening yang mendadak muncul sering dianggap amygdala sebagai ancaman. Otak lantas mencari "masalah yang belum kelar" untuk melindungimu — bukan karena kamu lemah.',
      authorInitials: 'SP',
      authorLabel: 'Ditulis oleh Tim Psikolog SKS',
    },
    closingQuote:
      'Kemajuan tidak selalu bising. Terkadang, cukup dengan tidak memaksakan diri hari ini.',
    closingAuthor: 'SKS • Sahabat heningmu',
  }
}

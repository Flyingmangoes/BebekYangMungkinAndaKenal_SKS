import type { Ph9Language } from "../ph9_service/ph9.schema";
import type { PH9Severity } from "../ph9_service/ph9.scoring";
import { ENERGY_LEVELS, QUESTS_PER_LEVEL, needsReachOut, QuestsByEnergy } from "./ai.schema";
import type { GeneratedQuest, GenerationInput, FocusArea, EnergyLevel } from "./ai.schema";

const BLOCKED_PATTERNS: readonly RegExp[] = [
  // English
  /\b(medic\w*|prescription|dose|dosage|antidepress\w*|supplement\w*)\b/i,
  /\b(diagnos\w*|disorder|depress\w*|cure|score|phq\w*|ph9)\b/i,
  /\b(diet|calorie\w*|fasting|weight|alcohol)\b/i,
  /\b(suicid\w*|self[- ]harm|hurt yourself|kill|die|dies|death|dead)\b/i,
  // intense exercise (English and Indonesian)
  /\b(workout|gym|hiit|jog\w*|sprint\w*|marathon)\b/i,
  /\b(lari|jogging|angkat beban|latihan berat)\b/i,
  // Indonesian
  /\b(obat|dosis|suplemen|diagnosis|gangguan|depresi|sembuh|penyembuhan|skor)\b/i,
  /\b(diet|kalori|puasa|berat badan|alkohol)\b/i,
  /\b(bunuh|mengakhiri hidup|mati|kematian|melukai|menyakiti diri)\b/i,
];

export const isSafeQuest = (quest: GeneratedQuest): boolean =>
  !BLOCKED_PATTERNS.some(
    (pattern) => pattern.test(quest.questTitle) || pattern.test(quest.questDescription),
  );

type FallbackKey = FocusArea | "general" | "reach_out" | "move" | "tidy" | "create" | "rest" | "comfort";

interface FallbackEntry {
  minutes: number; // time the quest asks for, compared against the severity cap
  energy: readonly EnergyLevel[]; // energy levels the quest suits
  text: Record<Ph9Language, GeneratedQuest>;
}

const ALL: readonly EnergyLevel[] = ["low", "medium", "high"];

const FALLBACK_QUESTS: Record<FallbackKey, FallbackEntry> = {
  general: {
    minutes: 2, energy: ALL,
    text: {
      en: { questTitle: "Five slow breaths", questDescription: "Sit comfortably and breathe in for 4 counts and out for 6 counts, five times. Notice how your body feels afterwards." },
      id: { questTitle: "Lima napas pelan", questDescription: "Duduk dengan nyaman, tarik napas 4 hitungan dan hembuskan 6 hitungan, ulangi lima kali. Perhatikan apa yang kamu rasakan setelahnya." },
    },
  },
  sleep: {
    minutes: 5, energy: ALL,
    text: {
      en: { questTitle: "Wind-down time", questDescription: "Put your phone away 20 minutes before bed and dim the lights. Do something calm, like gentle stretching or quiet music." },
      id: { questTitle: "Waktunya menenangkan diri", questDescription: "Simpan ponselmu 20 menit sebelum tidur dan redupkan lampu. Lakukan hal yang menenangkan, seperti peregangan ringan atau mendengarkan musik pelan." },
    },
  },
  energy: {
    minutes: 5, energy: ALL,
    text: {
      en: { questTitle: "Step into daylight", questDescription: "Spend 5 minutes outside or by an open window in natural light. A slow walk is enough." },
      id: { questTitle: "Keluar cari cahaya", questDescription: "Habiskan 5 menit di luar atau dekat jendela yang terbuka dengan cahaya alami. Berjalan santai saja sudah cukup." },
    },
  },
  mood: {
    minutes: 2, energy: ALL,
    text: {
      en: { questTitle: "One kind sentence", questDescription: "Write one kind sentence to yourself, as if you were talking to a friend. Keep it where you can see it." },
      id: { questTitle: "Satu kalimat baik", questDescription: "Tulis satu kalimat yang baik untuk dirimu sendiri, seolah kamu sedang bicara pada sahabat. Simpan di tempat yang mudah kamu lihat." },
    },
  },
  interest: {
    minutes: 10, energy: ALL,
    text: {
      en: { questTitle: "A tiny favorite", questDescription: "Pick something you used to enjoy, like a song, a show or a hobby, and spend 10 minutes on it. It's fine if it doesn't feel exciting yet." },
      id: { questTitle: "Hal kecil favoritmu", questDescription: "Pilih sesuatu yang dulu kamu suka, seperti lagu, tontonan, atau hobi, lalu luangkan 10 menit untuk itu. Tidak apa-apa kalau belum terasa seru." },
    },
  },
  self_worth: {
    minutes: 2, energy: ALL,
    text: {
      en: { questTitle: "One thing that went okay", questDescription: "Write down one thing you did today that went okay, however small. Small things count." },
      id: { questTitle: "Satu hal yang berjalan baik", questDescription: "Tulis satu hal yang berhasil kamu lakukan hari ini, sekecil apa pun. Hal kecil tetap berarti." },
    },
  },
  concentration: {
    minutes: 10, energy: ["medium", "high"],
    text: {
      en: { questTitle: "One task, ten minutes", questDescription: "Choose one small task and work on only that for 10 minutes. Take a short break afterwards." },
      id: { questTitle: "Satu tugas, sepuluh menit", questDescription: "Pilih satu tugas kecil dan kerjakan hanya itu selama 10 menit. Setelahnya, istirahatlah sebentar." },
    },
  },
  reach_out: {
    minutes: 2, energy: ALL,
    text: {
      en: { questTitle: "Say hi to someone you trust", questDescription: "Send a message to a friend or family member you trust. You don't need to explain everything, a simple hello is enough." },
      id: { questTitle: "Sapa orang yang kamu percaya", questDescription: "Kirim pesan ke teman atau keluarga yang kamu percaya. Kamu tidak perlu menjelaskan semuanya, sapaan sederhana sudah cukup." },
    },
  },
  // energy-specific quests
  move: {
    minutes: 10, energy: ["medium", "high"],
    text: {
      en: { questTitle: "Move for ten minutes", questDescription: "Take an easy walk or dance to one or two songs you like. Stop whenever you want." },
      id: { questTitle: "Bergerak sepuluh menit", questDescription: "Jalan santai atau menari mengikuti satu atau dua lagu yang kamu suka. Berhenti kapan saja kamu mau." },
    },
  },
  tidy: {
    minutes: 10, energy: ["high"],
    text: {
      en: { questTitle: "Tidy one small spot", questDescription: "Pick one small spot, like your desk or a shelf, and tidy it for 10 minutes. Stop when the time is up." },
      id: { questTitle: "Rapikan satu sudut kecil", questDescription: "Pilih satu sudut kecil, misalnya meja atau rak, lalu rapikan selama 10 menit. Berhenti saat waktunya habis." },
    },
  },
  create: {
    minutes: 10, energy: ["medium", "high"],
    text: {
      en: { questTitle: "Make something small", questDescription: "Doodle, write a few lines, or take a photo of something you like. It doesn't need to be good." },
      id: { questTitle: "Buat sesuatu yang kecil", questDescription: "Coba corat-coret, tulis beberapa baris, atau foto sesuatu yang kamu suka. Tidak perlu bagus." },
    },
  },
  rest: {
    minutes: 5, energy: ["low"],
    text: {
      en: { questTitle: "Rest your eyes", questDescription: "Lie down or sit back and close your eyes for 5 minutes. Let your thoughts pass without following them." },
      id: { questTitle: "Istirahatkan mata", questDescription: "Berbaring atau bersandar dan pejamkan mata selama 5 menit. Biarkan pikiran lewat tanpa perlu diikuti." },
    },
  },
  comfort: {
    minutes: 5, energy: ["low", "medium"],
    text: {
      en: { questTitle: "Something comforting", questDescription: "Wrap yourself in a blanket or have something warm to drink, and listen to one calm song." },
      id: { questTitle: "Sesuatu yang menenangkan", questDescription: "Berselimut atau minum sesuatu yang hangat, sambil mendengarkan satu lagu yang tenang." },
    },
  },
};

const ALL_KEYS = Object.keys(FALLBACK_QUESTS) as FallbackKey[];

// Same caps as the prompt's effort levels.
const EFFORT_CAP_MINUTES: Record<PH9Severity, number> = {
  minimal: 15,
  mild: 10,
  moderate: 10,
  moderately_severe: 5,
  severe: 5,
};

const ENERGY_PRIORITY: Record<EnergyLevel, FallbackKey[]> = {
  low: ["rest", "comfort"],
  medium: ["move", "energy", "comfort"],
  high: ["move", "create", "tidy", "energy"],
};

export const pickFallbackSet = (input: GenerationInput): QuestsByEnergy => {
  const cap = EFFORT_CAP_MINUTES[input.severity];
  const used = new Set<FallbackKey>();
  const set: QuestsByEnergy = { low: [], medium: [], high: [] };

  for (const level of ENERGY_LEVELS) {
    const priority: FallbackKey[] = [
      ...(level === "low" && needsReachOut(input.severity) ? (["reach_out"] as const) : []),
      ...ENERGY_PRIORITY[level],
      ...input.focusAreas,
      "general",
      ...ALL_KEYS,
    ];

    const picks = [...new Set(priority)]
      .filter((key) => {
        const entry = FALLBACK_QUESTS[key];
        return !used.has(key) && entry.minutes <= cap && entry.energy.includes(level);
      })
      .slice(0, QUESTS_PER_LEVEL);

    picks.forEach((key) => used.add(key));
    set[level] = picks.map((key) => FALLBACK_QUESTS[key].text[input.language]);
  }
  return set;
};
import type { Ph9Language } from "../ph9_service/ph9.schema";
import type { PH9Severity } from "../ph9_service/ph9.scoring";
import type { GeneratedInsight } from "./ai.insight.schema";

// Same intent as BLOCKED_PATTERNS in ai.safety.fallback.ts, kept here so that file stays untouched.
const BLOCKED_PATTERNS: readonly RegExp[] = [
  /\b(medic\w*|prescription|dose|dosage|antidepress\w*|supplement\w*)\b/i,
  /\b(diagnos\w*|disorder|depress\w*|cure|score|phq\w*|ph9|severity|severe)\b/i,
  /\b(diet|calorie\w*|fasting|weight|alcohol)\b/i,
  /\b(suicid\w*|self[- ]harm|hurt yourself|kill|die|dies|death|dead)\b/i,
  /\b(workout|gym|hiit|jog\w*|sprint\w*|marathon)\b/i,
  /\b(obat|dosis|suplemen|diagnosis|gangguan|depresi|sembuh|penyembuhan|skor|parah)\b/i,
  /\b(kalori|puasa|berat badan|alkohol)\b/i,
  /\b(bunuh|mengakhiri hidup|mati|kematian|melukai|menyakiti diri)\b/i,
  // score-like numbers ("12/27", "12 out of 27", "12 dari 27"). Plain "5 minutes" is fine.
  /\b\d+\s*(\/|out of|dari)\s*27\b/i,
];

export const isSafeInsight = (insight: GeneratedInsight): boolean => {
  const texts = [insight.summary, ...insight.tips];
  return !texts.some((text) => BLOCKED_PATTERNS.some((pattern) => pattern.test(text)));
};

type Band = "light" | "heavy";

const bandOf = (severity: PH9Severity): Band =>
  severity === "minimal" || severity === "mild" ? "light" : "heavy";

const SUMMARY: Record<PH9Severity, Record<Ph9Language, string>> = {
  minimal: {
    en: "Your answers suggest you're doing okay right now. Keep going with the habits that help you feel steady.",
    id: "Jawabanmu menunjukkan kamu sedang baik-baik saja. Teruskan kebiasaan yang membuatmu merasa stabil.",
  },
  mild: {
    en: "Your answers suggest you've had a few hard days lately, and that's normal. Small, kind habits can help.",
    id: "Jawabanmu menunjukkan kamu mengalami beberapa hari yang berat belakangan ini, dan itu wajar. Kebiasaan kecil yang baik bisa membantu.",
  },
  moderate: {
    en: "Your answers suggest things have felt heavy lately. You don't have to handle it alone, and small steps count.",
    id: "Jawabanmu menunjukkan belakangan ini terasa berat. Kamu tidak harus menghadapinya sendirian, dan langkah kecil tetap berarti.",
  },
  moderately_severe: {
    en: "Your answers suggest things have felt really heavy lately. Be gentle with yourself and think about talking to someone you trust.",
    id: "Jawabanmu menunjukkan belakangan ini terasa sangat berat. Bersikaplah lembut pada dirimu dan pertimbangkan bicara dengan orang yang kamu percaya.",
  },
  severe: {
    en: "Your answers suggest things have felt really heavy lately. Be gentle with yourself and please talk to someone you trust or a counsellor soon.",
    id: "Jawabanmu menunjukkan belakangan ini terasa sangat berat. Bersikaplah lembut pada dirimu dan segeralah bicara dengan orang yang kamu percaya atau konselor.",
  },
};

const TIPS: Record<Band, Record<Ph9Language, string[]>> = {
  light: {
    en: [
      "Spend 10 minutes on something you enjoy, like a song or a short walk.",
      "Write down one thing that went okay today, however small.",
      "Keep a steady sleep time tonight and put your phone away before bed.",
    ],
    id: [
      "Luangkan 10 menit untuk sesuatu yang kamu suka, seperti mendengarkan lagu atau jalan santai.",
      "Tulis satu hal yang berjalan baik hari ini, sekecil apa pun.",
      "Tidur di jam yang teratur malam ini dan simpan ponselmu sebelum tidur.",
    ],
  },
  heavy: {
    en: [
      "Send a message to a friend, family member or counsellor you trust. A simple hello is enough.",
      "Take five slow breaths: in for 4 counts, out for 6 counts.",
      "Step into daylight or sit by an open window for 5 minutes.",
    ],
    id: [
      "Kirim pesan ke teman, keluarga, atau konselor yang kamu percaya. Sapaan sederhana sudah cukup.",
      "Tarik napas pelan lima kali: tarik 4 hitungan, hembuskan 6 hitungan.",
      "Keluar cari cahaya atau duduk dekat jendela terbuka selama 5 menit.",
    ],
  },
};

export const pickFallbackInsight = (severity: PH9Severity, language: Ph9Language): GeneratedInsight => ({
  summary: SUMMARY[severity][language],
  tips: TIPS[bandOf(severity)][language],
});
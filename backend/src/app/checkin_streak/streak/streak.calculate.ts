const MS_PER_DAY = 24 * 60 * 60 * 1000;

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: Date | null; // tanggal kalender (UTC midnight), cocok dengan kolom @db.Date
}

export const isValidTimezone = (tz: string): boolean => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

// "YYYY-MM-DD" menurut kalender di timezone user
export const toDateKey = (date: Date, timeZone: string): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);

export const dateKeyToDate = (key: string): Date => new Date(`${key}T00:00:00.000Z`);

export const dateToKey = (date: Date): string => date.toISOString().slice(0, 10);

export const diffInDays = (fromKey: string, toKey: string): number =>
  Math.round((dateKeyToDate(toKey).getTime() - dateKeyToDate(fromKey).getTime()) / MS_PER_DAY);

// Streak baru setelah check-in di hari `todayKey`
export function calculateNextStreak(prev: StreakState | null, todayKey: string): StreakState {
  const today = dateKeyToDate(todayKey);
  if (!prev || !prev.lastCheckInDate) {
    return { currentStreak: 1, longestStreak: Math.max(prev?.longestStreak ?? 0, 1), lastCheckInDate: today };
  }

  const gap = diffInDays(dateToKey(prev.lastCheckInDate), todayKey);
  if (gap <= 0) return prev; // hari yang sama / tanggal mundur: tidak berubah

  const currentStreak = gap === 1 ? prev.currentStreak + 1 : 1;
  return {
    currentStreak,
    longestStreak: Math.max(prev.longestStreak, currentStreak),
    lastCheckInDate: today,
  };
}

// Streak yang ditampilkan: dianggap putus (0) jika terakhir check-in lebih dari kemarin
export function effectiveStreak(prev: StreakState | null, todayKey: string): number {
  if (!prev || !prev.lastCheckInDate) return 0;
  const gap = diffInDays(dateToKey(prev.lastCheckInDate), todayKey);
  return gap <= 1 ? prev.currentStreak : 0;
}
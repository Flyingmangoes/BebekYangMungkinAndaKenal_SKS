import type { CheckIn } from "../../../generated/prisma/client";
import { AuthError } from "../../../error/exception";
import { CheckinRepository } from "./checkin.repo";
import { StreakRepository } from "../streak/streak.repo";
import {
  calculateNextStreak,
  dateKeyToDate,
  dateToKey,
  effectiveStreak,
  isValidTimezone,
  toDateKey,
} from "../streak/streak.calculate";

export interface StreakSummary {
  currentStreak: number;
  longestStreak: number;
  checkedInToday: boolean;
}

export interface CheckinResult {
  checkIn: CheckIn;
  streak: StreakSummary;
}

export class CheckinService {
  constructor(
    private readonly checkinRepo: CheckinRepository,
    private readonly streakRepo: StreakRepository,
  ) {}

  async checkIn(userId: string, now: Date = new Date()): Promise<CheckinResult> {
    const todayKey = await this.todayKeyFor(userId, now);
    const checkInDate = dateKeyToDate(todayKey);

    // cek cepat; unique (userId, checkInDate) tetap jadi pengaman untuk race condition
    if (await this.checkinRepo.findByDate(userId, checkInDate)) {
      throw new AuthError("ALREADY_CHECKED_IN");
    }

    return this.checkinRepo.transaction(async (tx) => {
      const checkIn = await this.checkinRepo.create(userId, checkInDate, tx);

      const prev = await this.streakRepo.findByUserId(userId, tx);
      const next = calculateNextStreak(prev, todayKey);
      const saved = await this.streakRepo.upsert(userId, next, tx);

      return {
        checkIn,
        streak: {
          currentStreak: saved.currentStreak,
          longestStreak: saved.longestStreak,
          checkedInToday: true,
        },
      };
    });
  }

  async getStreak(userId: string, now: Date = new Date()): Promise<StreakSummary> {
    const todayKey = await this.todayKeyFor(userId, now);
    const streak = await this.streakRepo.findByUserId(userId);

    return {
      currentStreak: effectiveStreak(streak, todayKey),
      longestStreak: streak?.longestStreak ?? 0,
      checkedInToday: !!streak?.lastCheckInDate && dateToKey(streak.lastCheckInDate) === todayKey,
    };
  }

  async getHistory(userId: string, limit: number): Promise<CheckIn[]> {
    return this.checkinRepo.listRecent(userId, limit);
  }

  private async todayKeyFor(userId: string, now: Date): Promise<string> {
    const user = await this.checkinRepo.findUserTimezone(userId);
    if (!user) throw new AuthError("USER_NOT_FOUND");
    const tz = isValidTimezone(user.timezone) ? user.timezone : "UTC";
    return toDateKey(now, tz);
  }
}
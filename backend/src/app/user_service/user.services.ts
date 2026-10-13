import bcrypt from "bcrypt";
import { AuthError } from "../../error/exception";
import type { AccountDetailUpdate, ProfileUpdate, SelfUser } from "../../models/model_list";
import { UserRepository } from "./user.repo";

export interface UserServiceOptions {
  bcryptCost?: number;
}

const isValidTimezone = (tz: string): boolean => {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz }); 
    return true;
  } catch {
    return false;
  }
};

export class UserService {
  private readonly bcryptCost: number;

  constructor(
    private readonly userRepo: UserRepository,
    opts: UserServiceOptions = {},
  ) {
    this.bcryptCost = opts.bcryptCost ?? 12;
  }

  async updateProfile(userId: string, input: ProfileUpdate): Promise<SelfUser> {
    // Build the object field by field: anything not listed here can't be changed.
    const data: ProfileUpdate = {
      username: input.username?.trim().toLowerCase(),
      fullname: input.fullname?.trim(),
    };
    return this.applyUpdate(userId, data);
  }

  async updateAccountDetail(userId: string, input: AccountDetailUpdate): Promise<SelfUser> {
    if (input.timezone !== undefined && !isValidTimezone(input.timezone)) {
      throw new AuthError("INVALID_INPUT");
    }
    const data: AccountDetailUpdate = {
      phoneNumber: input.phoneNumber?.trim(),
      location: input.location?.trim(),
      country: input.country?.trim(),
      timezone: input.timezone,
    };
    return this.applyUpdate(userId, data);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    await this.verifyPassword(userId, currentPassword);
    const passwordHashed = await bcrypt.hash(newPassword, this.bcryptCost);
    await this.userRepo.updatePasswordAndRevokeSessions(userId, passwordHashed);
  }

  async removeAccount(userId: string, currentPassword: string): Promise<void> {
    await this.verifyPassword(userId, currentPassword);
    const deleted = await this.userRepo.removeAccount(userId);
    if (!deleted) throw new AuthError("USER_NOT_FOUND");
  }

  private applyUpdate(userId: string, data: ProfileUpdate | AccountDetailUpdate): Promise<SelfUser> {
    // undefined fields are ignored by Prisma; reject a request that changes nothing.
    if (Object.values(data).every((v) => v === undefined)) throw new AuthError("INVALID_INPUT");
    return this.userRepo.updateAccount(userId, data);
  }

  private async verifyPassword(userId: string, password: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user || !(await bcrypt.compare(password, user.passwordHashed))) {
      throw new AuthError("WRONG_PASSWORD");
    }
  }
}
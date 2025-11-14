import { ISqlBaseRepository } from '@Pick2Me/shared/sql';
import { IUser } from '@/entities/user.interface';

export interface IUserRepository extends ISqlBaseRepository<IUser> {
  findByMobile(mobile: string): Promise<IUser | null>;

  findByEmail(email: string): Promise<IUser | null>;

  checkUserExists(mobile: string, email: string): Promise<IUser | null>;

  getUserWithTransactions(id: string): Promise<IUser | null>;

  findByReferralCode(code: string): Promise<IUser | null>;
}

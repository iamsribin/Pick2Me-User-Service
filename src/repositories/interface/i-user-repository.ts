import { User } from '../../entities/user.entity';
import { IBaseRepository } from './i-base-repo';

export interface IUserRepository extends IBaseRepository<User> {
  /**
   * Find a user by mobile number.
   * @param mobile - User's mobile number
   */
  findByMobile(mobile: string): Promise<User | null>;

  /**
   * Find a user by email address.
   * @param email - User's email address
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Check if a user exists by mobile or email.
   * @param mobile - User's mobile number
   * @param email - User's email address
   */
  checkUserExists(mobile: string, email: string): Promise<User | null>;

  /**
   * Get a user with all their related transactions.
   * @param id - User ID
   */
  getUserWithTransactions(id: string): Promise<User | null>;
}

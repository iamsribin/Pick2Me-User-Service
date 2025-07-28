import { AppDataSource } from '../../config/sql-database';
import { User } from '../../entities/user.entity';
import { RegistrationData, IUserRepository } from '../interface/IUserRepo';
import { handleControllerError } from '../../utilities/handleError';
import { validateInput } from '../../utilities/validations/repoValidation';
import { IUser } from '../../interface/user.interface';

export default class UserRepository implements IUserRepository {
  private userRepo = AppDataSource.getRepository(User);

  async saveUser(userData: RegistrationData): Promise<IUser> {
    try {
      const existingUser = await this.userRepo.findOne({ where: {} });

      const newUser = this.userRepo.create({
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password,
        referral_code: userData.referral_code,
        user_image: userData.userImage ?? undefined,
        joining_date: new Date(),
        is_admin: existingUser ? false : true,
      });

      const savedUser = await this.userRepo.save(newUser);
      
      // Transform entity to interface format
      return this.transformUserToInterface(savedUser);
    } catch (error) {
      throw handleControllerError(error, 'User save');
    }
  }

  async checkUser(mobile: string, email: string): Promise<IUser | null> {
    try {
      const user = await this.userRepo.findOne({
        where: [{ mobile }, { email }], // Fixed: should be OR condition
      });

      return user ? this.transformUserToInterface(user) : null;
    } catch (error) {
      throw handleControllerError(error, 'User check');
    }
  }

  async findUser(mobile: string): Promise<IUser | null> {
    try {
      const user = await this.userRepo.findOne({ where: { mobile } });
      return user ? this.transformUserToInterface(user) : null;
    } catch (error) {
      throw handleControllerError(error, 'User search by mobile');
    }
  }

  async findEmail(email: string): Promise<IUser | null> {
    try {
      validateInput({ email });

      const user = await this.userRepo.findOne({ where: { email } });
      return user ? this.transformUserToInterface(user) : null;
    } catch (error) { 
      throw handleControllerError(error, 'User search by email');
    }
  }

  async findUserWithStatus(status: 'Good' | 'Block'): Promise<IUser[]> {
    try {
      const users = await this.userRepo.find({
        where: {
          account_status: status,
          is_admin: false,
        },
        select: [
          'id',
          'name',
          'email',
          'mobile',
          'user_image',
          'referral_code',
          'account_status',
          'joining_date',
          'wallet_balance',
          'cancel_ride_count',
          'completed_ride_count',
        ],
      });

      return users.map(user => this.transformUserToInterface(user));
    } catch (error) {
      throw handleControllerError(error, 'User search by status');
    }
  }

  async findAndUpdate(id: string, status: 'Good' | 'Block'): Promise<IUser | null> {
    try {
      validateInput({ id, status });

      await this.userRepo.update(id, { account_status: status });
      const updatedUser = await this.userRepo.findOne({ where: { id } });
      return updatedUser ? this.transformUserToInterface(updatedUser) : null;
    } catch (error) {
      throw handleControllerError(error, 'User status update');
    }
  }

  async findUserById(id: string): Promise<IUser | null> {
    try {
      validateInput({ id });

      const user = await this.userRepo.findOne({ where: { id } });
      return user ? this.transformUserToInterface(user) : null;
    } catch (error) {
      throw handleControllerError(error, 'User search by ID');
    }
  }

  async getUserDetails(id: string): Promise<IUser | null> {
    try {
      validateInput({ id });

      // Load user with transactions when we specifically need them
      const user = await this.userRepo.findOne({ 
        where: { id },
        relations: ['transactions'] // Load transactions only when needed
      });
      
      return user ? this.transformUserToInterface(user, true) : null;
    } catch (error) {
      throw handleControllerError(error, 'User details retrieval');
    }
  }

  async updateUserStatus(id: string, status: 'Good' | 'Block', reason: string): Promise<IUser | null> {
    try {
      validateInput({ id, status, reason });

      await this.userRepo.update(id, {
        account_status: status,
        reason: reason,
      });

      const updatedUser = await this.userRepo.findOne({ where: { id } });
      return updatedUser ? this.transformUserToInterface(updatedUser) : null;
    } catch (error) {
      throw handleControllerError(error, 'User status and reason update');
    }
  }

  /**
   * Transform User entity to IUser interface
   * @param user - User entity from database
   * @param includeTransactions - Whether to include transactions in the response
   * @returns IUser interface
   */
  private transformUserToInterface(user: User, includeTransactions: boolean = false): IUser {
    const transformedUser: IUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      password: user.password,
      user_image: user.user_image,
      referral_code: user.referral_code,
      joining_date: user.joining_date,
      account_status: user.account_status,
      reason: user.reason,
      is_admin: user.is_admin,
      wallet_balance: user.wallet_balance,
      cancel_ride_count: user.cancel_ride_count,
      completed_ride_count: user.completed_ride_count,
    };

    if (includeTransactions && user.transactions) {
      transformedUser.transactions = user.transactions.map(transaction => ({
        id: transaction.id,
        transaction_id: transaction.transaction_id,
        date: transaction.date,
        details: transaction.details,
        ride_id: transaction.ride_id,
        amount: transaction.amount,
        status: transaction.status,
        user: user.id, // Map the user relationship
      }));
    }

    return transformedUser;
  }
}
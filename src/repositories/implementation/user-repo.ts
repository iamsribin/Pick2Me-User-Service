import { injectable } from 'inversify';
import { User } from '../../entities/user.entity';
import { IUserRepository } from '../interface/i-user-repository';
import { BaseRepository } from './base-repo';

@injectable()
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return await this.findOne({ mobile });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ email });
  }

  async checkUserExists(mobile: string, email: string): Promise<User | null> {
    try {
      return await this.repo.findOne({
        where: [{ mobile }, { email }],
      });
    } catch (error) {
      throw new Error('Check user by mobile/email');
    }
  }

  async getUserWithTransactions(id: string): Promise<User | null> {
    try {
      return await this.repo.findOne({
        where: { id },
        relations: ['transactions'],
      });
    } catch (error) {
      throw new Error( 'Get user with transactions');
    }
  }
}

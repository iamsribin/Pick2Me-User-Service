import { ServiceResponse } from '../../dto/serviceResponse';
import UserRepository from '../../repositories/implementation/userRepo';
import { handleControllerError } from '../../utilities/handleError';
import { validateInput } from '../../utilities/validations/adminServiceValidation';
import { IAdminService } from '../interfaces/IAdminService';

export default class AdminService implements IAdminService {
  constructor(
    private readonly userRepo: UserRepository
  ) {}

  async getUserWithStatus(status: 'Good' | 'Block'): Promise<ServiceResponse> {
    try {
      const users = await this.userRepo.findUserWithStatus(status);
      console.log("users", users);

      return {
        message: `${status === 'Good' ? 'Active' : 'Blocked'} users retrieved successfully`,
        data: users,
      };
    } catch (error) {
      console.log(error);
      throw handleControllerError(error, 'User data retrieval');
    }
  }

  async getUserDetails(id: string): Promise<ServiceResponse> {
    try {
      validateInput({ id });
      const user = await this.userRepo.getUserDetails(id); // This will include transactions

      if (!user) {
        throw new Error('User not found');
      }

      const data = {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        userImage: user.user_image,
        joiningDate: user.joining_date?.toLocaleDateString(),
        account_status: user.account_status,
        balance: user.wallet_balance || 0,
        referral_code: user.referral_code,
        total_transactions: user.transactions?.length || 0,
        completed_rides: user.completed_ride_count || 0,
        cancelled_rides: user.cancel_ride_count || 0,
        reason: user.reason,
      };

      return { message: 'User details retrieved successfully', data };
    } catch (error) {
      throw handleControllerError(error, 'User details retrieval');
    }
  }

  async updateUserStatus(id: string, status: 'Good' | 'Block', reason: string): Promise<ServiceResponse> {
    try {
      validateInput({ id, status, reason });
      const user = await this.userRepo.updateUserStatus(id, status, reason);

      if (!user) {
        throw new Error('User not found');
      }

      return { message: 'User status updated successfully', data: user };
    } catch (error) {
      throw handleControllerError(error, 'User status update');
    }
  }
}
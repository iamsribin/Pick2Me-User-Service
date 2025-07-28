import { ServiceResponse } from '../../dto/serviceResponse';
import  UserRepository  from '../../repositories/implementation/userRepo';
import { handleControllerError } from '../../utilities/handleError';
import { validateInput } from '../../utilities/validations/adminServiceValidation';
import { IAdminService } from '../interfaces/IAdminService';

export default class AdminService implements IAdminService {
  constructor(
    private readonly userRepo: UserRepository
  ) {}

  /**
   * Retrieves users by account status
   * @param status - Account status ('Good' or 'Block')
   * @returns Promise resolving to the users
   * @throws Error if retrieval fails
   */
  async getUserWithStatus(status: 'Good' | 'Block'): Promise<any> {
    try {
      const users = await this.userRepo.findUserWithStatus(status);
      console.log("users",users);
      
      return {
        message: `${status === 'Good' ? 'Active' : 'Blocked'} users retrieved successfully`,
        data: users,
      };
    } catch (error) {
      console.log(error);
      
      throw handleControllerError(error, 'User data retrieval');
    }
  }

  /**
   * Retrieves detailed user information by ID
   * @param id - User ID
   * @returns Promise resolving to the formatted user details
   * @throws Error if retrieval fails
   */
  async getUserDetails(id: string): Promise<ServiceResponse> {
    try {
      validateInput({ id });
      const user = await this.userRepo.getUserDetails(id);

      if (!user) {
        throw new Error('User not found');
      }

      const data = {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        userImage: user.userImage,
        joiningDate: user.joiningDate?.toLocaleDateString(),
        account_status: user.account_status,
        balance: user.wallet?.balance,
        referral_code: user.referral_code,
        total_transactions: user.wallet?.transactions?.length,
        completed_rides: user.RideDetails?.completedRides,
        cancelled_rides: user.RideDetails?.cancelledRides,
        reason: user.reasone,
      };

      return { message: 'User details retrieved successfully', data };
    } catch (error) {
      throw handleControllerError(error, 'User details retrieval');
    }
  }

  /**
   * Updates a user's status and reason
   * @param id - User ID
   * @param status - New account status ('Good' or 'Block')
   * @param reason - Reason for status change
   * @returns Promise resolving to the updated user
   * @throws Error if update fails
   */
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
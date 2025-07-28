import AdminService from '../../services/implementation/admin_service';
import { handleControllerError } from '../../utilities/handleError';
import { IAdminController, ControllerCallback, AdminGetUserDataResponse, AdminUpdateUserStatusResponse, AdminGetDataResponse } from '../interfaces/IAdminController';

export class AdminController implements IAdminController {
  constructor(
    private readonly AdminService: AdminService
  ) {}

  /**
   * Retrieves active users
   * @param call - Empty request object
   * @param callback - Callback to return the active users or error
   */

  async getActiveUser(
    call: { request: {} },
    callback: ControllerCallback<AdminGetDataResponse>
  ): Promise<void> {
    try {
      console.log("get Activ");
      
      const response = await this.AdminService.getUserWithStatus('Good');
      const users = response.data;
      callback(null, { Users: users });
    } catch (error) {
      callback(handleControllerError(error, 'Active user retrieval'));
    }
  }

  /**
   * Retrieves blocked users
   * @param call - Empty request object
   * @param callback - Callback to return the blocked users or error
   */
  async getBlockedUsers(
    call: { request: {} },
    callback: ControllerCallback<AdminGetDataResponse>
  ): Promise<void> {
    try {
      const response = await this.AdminService.getUserWithStatus('Block');
      const users = response.data;
      callback(null, { Users: users });
    } catch (error) {
      callback(handleControllerError(error, 'Blocked user retrieval'));
    }
  }

  /**
   * Retrieves details for a specific user
   * @param call - Request object containing the user ID
   * @param callback - Callback to return the user details or error
   */
  async getUserDetails(
    call: { request: { id: string } },
    callback: ControllerCallback<AdminGetUserDataResponse>
  ): Promise<void> {
    try {
      const { id } = call.request;
      const response = await this.AdminService.getUserDetails(id);
      
      const userData: AdminGetUserDataResponse = {
        _id: id,
        name: response.data.name,
        email: response.data.email,
        mobile: response.data.mobile.toString(),
        userImage: response.data.userImage,
        referral_code: response.data.referral_code,
        account_status: response.data.account_status,
        balance: response.data.balance,
        total_transactions: response.data.total_transactions,
        completed_rides: response.data.completed_rides,
        cancelled_rides: response.data.cancelled_rides,
        joiningDate: response.data.joiningDate,
        reason: response.data.reason
      };
  
      callback(null, userData);
    } catch (error) {
      callback(handleControllerError(error, 'User details retrieval'));
    }
  }

  /**
   * Updates the status of a user
   * @param call - Request object containing the user ID, status, and reason
   * @param callback - Callback to return the update result or error
   */
  async updateUserStatus(
    call: { request: { id: string; status: 'Good' | 'Block'; reason: string } },
    callback: ControllerCallback<AdminUpdateUserStatusResponse>
  ): Promise<void> {
    try {
      const { id, status, reason } = call.request;
      const response = await this.AdminService.updateUserStatus(id, status, reason);
      console.log("updateUserStatus response",response,id);
      
      callback(null, { message: response.message, user_id: id });
    } catch (error) {
      callback(handleControllerError(error, 'User status update'));
    }
  }
}

export default AdminController;
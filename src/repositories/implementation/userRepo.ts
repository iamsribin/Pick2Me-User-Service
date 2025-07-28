import User  from '../../model/user.schema';
import { UserInterface } from '../../interface/user.interface'; 
import { IUserRepository, RegistrationData } from '../interface/IUserRepo';
import { handleControllerError } from '../../utilities/handleError';
import { validateInput } from '../../utilities/validations/repoValidation';

export default class UserRepository implements IUserRepository {
  /**
   * Saves a new user to the database
   * @param userData - User data including name, email, mobile, password, referral code, and optional image
   * @returns Promise resolving to the saved user
   * @throws Error if saving fails
   */
  async saveUser(userData: RegistrationData): Promise<UserInterface> {
    try {

      const existingUser = await User.findOne();
      const newUser = new User({
        name: userData.name,
        email: userData.email,
        mobile: userData.mobile,
        password: userData.password,
        referral_code: userData.referral_code,
        userImage: userData.userImage,
        joiningDate: new Date(),
        isAdmin: existingUser ? false : true,
      });

      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      throw handleControllerError(error, 'User save');
    }
  }

  /**
   * Checks if a user exists by mobile or email
   * @param mobile - User's mobile number
   * @param email - User's email address
   * @returns Promise resolving to the user or null
   * @throws Error if check fails
   */
  async checkUser(mobile: string, email: string): Promise<UserInterface | null> {
    try {

      const user = await User.findOne({ $or: [{ mobile }, { email }] });
      return user;
    } catch (error) {
      throw handleControllerError(error, 'User check');
    }
  }

  /**
   * Finds a user by mobile number
   * @param mobile - User's mobile number
   * @returns Promise resolving to the user or null
   * @throws Error if search fails
   */
  async findUser(mobile: string): Promise<UserInterface | null> {
    try {
      const user = await User.findOne({ mobile });
      return user;
    } catch (error) {
      throw handleControllerError(error, 'User search by mobile');
    }
  }

  /**
   * Finds a user by email
   * @param email - User's email address
   * @returns Promise resolving to the user or null
   * @throws Error if search fails
   */
  async findEmail(email: string): Promise<UserInterface | null> {
    try {
      validateInput({ email });
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw handleControllerError(error, 'User search by email');
    }
  }

  /**
   * Finds users by account status
   * @param status - Account status ('Good' or 'Block')
   * @returns Promise resolving to an array of users
   * @throws Error if search fails
   */
  async findUserWithStatus(status: 'Good' | 'Block'): Promise<UserInterface[]> {
    try {
      validateInput({ status });
      const users = await User.find(
        { account_status: status, isAdmin: { $ne: true } },
        {
          name: 1,
          email: 1,
          mobile: 1,
          userImage: 1,
          referral_code: 1,
          account_status: 1,
          _id: 1,
          joiningDate: 1
        }
      ).lean();
      return users;
    } catch (error) {
      throw handleControllerError(error, 'User search by status');
    }
  }

  /**
   * Updates a user's account status by ID
   * @param id - User ID
   * @param status - New account status ('Good' or 'Block')
   * @returns Promise resolving to the updated user or null
   * @throws Error if update fails
   */
  async findAndUpdate(id: string, status: 'Good' | 'Block'): Promise<UserInterface | null> {
    try {
      validateInput({ id, status });
      const user = await User.findByIdAndUpdate(id, { $set: { account_status: status } }, { new: true });
      return user;
    } catch (error) {
      throw handleControllerError(error, 'User status update');
    }
  }

  /**
   * Finds a user by ID
   * @param id - User ID
   * @returns Promise resolving to the user or null
   * @throws Error if search fails
   */
  async findUserById(id: string): Promise<UserInterface | null> {
    try {
      validateInput({ id });
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw handleControllerError(error, 'User search by ID');
    }
  }

  /**
   * Retrieves user details by ID
   * @param id - User ID
   * @returns Promise resolving to the user or null
   * @throws Error if retrieval fails
   */
  async getUserDetails(id: string): Promise<UserInterface | null> {
    try {
      validateInput({ id });
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw handleControllerError(error, 'User details retrieval');
    }
  }

  /**
   * Updates a user's status and reason by ID
   * @param id - User ID
   * @param status - New account status ('Good' or 'Block')
   * @param reason - Reason for status change
   * @returns Promise resolving to the updated user or null
   * @throws Error if update fails
   */
  async updateUserStatus(id: string, status: 'Good' | 'Block', reason: string): Promise<UserInterface | null> {
    try {
      validateInput({ id, status, reason });
      const user = await User.findByIdAndUpdate(
        id,
        { $set: { account_status: status, reason } },
        { new: true }
      );
      return user;
    } catch (error) {
      throw handleControllerError(error, 'User status and reason update');
    }
  }
}




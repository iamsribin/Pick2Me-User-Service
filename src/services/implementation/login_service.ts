import  UserRepository  from '../../repositories/implementation/userRepo';
import { AuthService } from '../../utilities/auth';
import { ILoginService} from '../interfaces/ILoginService';
import { UserInterface } from '../../interface/user.interface';
import { handleControllerError } from '../../utilities/handleError';
import { ServiceResponse } from '../../dto/serviceResponse';

export default class LoginService implements ILoginService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly authService: AuthService
  ) {}

  /**
   * Handles user login logic, generating tokens if the user is valid
   * @param user - User data from the repository
   * @returns Promise resolving to the login response
   * @throws Error if token creation fails
   */
  private async handleLogin(user: UserInterface): Promise<ServiceResponse> {
    if (user.account_status === 'Block') {
      return { message: 'Blocked' };
    }

    const role = user.isAdmin ? 'Admin' : 'User';
    const token = await this.authService.createToken(user.id.toString(), '15m', role);
    const refreshToken = await this.authService.createToken(user.id.toString(), '7d', role);

    if (!token || !refreshToken) {
      throw new Error('Issue in token creation');
    }
    
    return {
      message: 'Success',
      data: {
        name: user.name,
        token,
        _id: user.id.toString(),
        refreshToken,
        role,
        mobile:user.mobile,
        profile: user.userImage
      },
    };
  }

  /**
   * Authenticates a user by mobile number
   * @param mobile - User's mobile number
   * @returns Promise resolving to the authentication result
   * @throws Error if authentication fails
   */
  async checkLoginUser(mobile: string): Promise<ServiceResponse> {
    try {

      const user = await this.userRepo.findUser(mobile);

      if (!user) {
        return { message: 'No user found' };
      }

      return await this.handleLogin(user);
    } catch (error) {
      console.log("checkLoginUser err",error);
      
      throw handleControllerError(error, 'User authentication');
    }
  }

  /**
   * Authenticates a user by Google account email
   * @param email - User's email address
   * @returns Promise resolving to the authentication result
   * @throws Error if authentication fails
   */
  async checkGoogleUser(email: string): Promise<ServiceResponse> {
    try {
      const user = await this.userRepo.findEmail(email);

      if (!user) {
        return { message: 'No user found' };
      }

      return await this.handleLogin(user);
    } catch (error) {
      throw handleControllerError(error, 'Google authentication');
    }
  }
}
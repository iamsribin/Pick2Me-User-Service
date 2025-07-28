import  UserRepository  from '../../repositories/implementation/userRepo';
import { IRegistrationService } from '../interfaces/IRegistrationService';
import bcrypt from '../../utilities/bcrypt';
import { UserData } from "../../dto/registrationServiceDTO";
import { generateReferralCode } from '../../utilities/refferalCodeGenarate';
import { ServiceResponse } from '../../dto/serviceResponse';


export class RegistrationService implements IRegistrationService {
  constructor(
    private readonly userRepo: UserRepository
  ) {}

  /**
   * Registers a new user with hashed password and generated referral code
   * @param userData - User data including name, email, mobile, password, and optional image
   * @returns Promise resolving to the registration result
   * @throws Error if registration fails
   */
  async user_registration(userData: UserData): Promise<any> {
    const { name, email, mobile, password, reffered_Code, userImage } = userData;

    const referral_code = reffered_Code || generateReferralCode();
    const hashedPassword = await bcrypt.securePassword(password);

    const newUserData = {
      name,
      email,
      mobile,
      password: hashedPassword,
      referral_code,
      userImage,
    };

    const response = await this.userRepo.saveUser(newUserData);

    if (typeof response !== 'string' && response.id) {
      return { message: 'User registered successfully', data: response };
    }
    throw new Error(typeof response === 'string' ? response : 'Failed to register user');
  }

  /**
   * Checks if a user exists by mobile or email
   * @param mobile - User's mobile number
   * @param email - User's email address
   * @returns Promise resolving to the check result
   * @throws Error if user check fails
   */
  async checkUser(mobile: string, email: string): Promise<ServiceResponse> {
    try {
          const user = await this.userRepo.checkUser(mobile, email);
console.log("mobile, email",mobile, email);

    if (user) {
      return { message: 'User already has an account', data: user };
    }
    return { message: 'User not registered' };
    } catch (error) {
      console.log("ervice errro",error);
      return { message: 'internel error' };
    }

  }
}

export default RegistrationService;
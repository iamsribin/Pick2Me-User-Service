import { RegisterUserDataDto } from '../../dto/request/registration-request.dto';
import { RegisterResponseDto, CheckUserResponseDto, ResendOtpResponseDto } from '../../dto/response/registration-response.dto';

export interface IRegistrationService {
  registerUser(userData: RegisterUserDataDto): Promise<RegisterResponseDto>;
  validateUserExistence(mobile: string, email: string): Promise<CheckUserResponseDto>;
  generateAndSendOtp(email: string, name: string): Promise<ResendOtpResponseDto>;
  verifyOtpAndRegister(userData: RegisterUserDataDto, otp: string, token: string): Promise<RegisterResponseDto>;
}
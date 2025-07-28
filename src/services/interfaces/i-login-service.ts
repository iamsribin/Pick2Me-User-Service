import { LoginResponseDto } from '../../dto/response/login-response.dto';

export interface ILoginService {
  authenticateUserByMobile(mobile: string): Promise<LoginResponseDto>;
  authenticateUserByGoogle(email: string): Promise<LoginResponseDto>;
}
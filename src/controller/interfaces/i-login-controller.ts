import { LoginResponseDto } from '../../dto/response/login-response.dto';
import { LoginByMobileRequestDto, LoginByGoogleRequestDto } from '../../dto/request/login-request.dto';

export type ControllerCallback<T = LoginResponseDto> = (
  error: Error | null,
  response?: T
) => void;

export interface ILoginController {
  checkLoginUser(
    call: { request: LoginByMobileRequestDto },
    callback: ControllerCallback<LoginResponseDto>
  ): Promise<void>;

  checkGoogleLoginUser(
    call: { request: LoginByGoogleRequestDto },
    callback: ControllerCallback<LoginResponseDto>
  ): Promise<void>;
}
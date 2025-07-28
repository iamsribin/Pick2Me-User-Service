import { UserData } from "../../dto/registrationServiceDTO";

export interface RegisterResponse {
  message: string;
}

export interface CheckUserResponse {
  message: string;
  token: string;
}

export interface ResendOtpResponse {
  message: string;
  token: string;
}

export type ControllerCallback<T = RegisterResponse | CheckUserResponse | ResendOtpResponse> = (
  error: Error | null,
  response?: T
) => void;

export interface IRegistrationController {
  signup(
    call: { request: UserData & { otp: string; token: string } },
    callback: ControllerCallback<RegisterResponse>
  ): Promise<void>;

  checkUser(
    call: { request: { mobile: string; email: string; name: string } },
    callback: ControllerCallback<CheckUserResponse>
  ): Promise<void>;

  resendOtp(
    call: { request: { email: string; name: string } },
    callback: ControllerCallback<ResendOtpResponse>
  ): Promise<void>;
}
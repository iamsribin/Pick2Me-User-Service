import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { IRegistrationService } from "../../services/interfaces/i-registration-service";
import { TYPES } from "../../inversify/types";

@injectable()
export class RegistrationController {
  constructor(
    @inject(TYPES.RegistrationService) private readonly _registrationService: IRegistrationService) {}

  /**
   * POST /api/user/register
   * Expects multipart/form-data (userImage optional) and OTP present in body.
   */
  register = async (req: Request, res: Response, _next: NextFunction) => {
    // TODO: validate req.body with zod/joi
    const {
      name,
      email,
      mobile,
      password,
      reffered_Code,
      otp, 
    } = req.body;

    const userImage = (req.file as Express.Multer.File | undefined)?.path ?? "";

    // token used to validate OTP (set earlier in checkUser)
    const token = req.cookies?.otp;

    const payload = { name, email, mobile, password, reffered_Code, userImage };

    const result = await this._registrationService.verifyOtpAndRegister(payload, otp, token);

    // choose status code based on result (service should return appropriate shape)
    res.status(201).json(result);
  };

  /**
   * POST /api/user/checkUser
   * Checks if user exists and issues OTP when missing. Returns { token, message, userExists? }
   */
  checkUser = async (req: Request, res: Response, _next: NextFunction) => {
    const { mobile, email, name } = req.body;
    // validate inputs...

    const userCheckResult = await this._registrationService.validateUserExistence(mobile, email);

    if (!userCheckResult.userExists) {
      const otpResult = await this._registrationService.generateAndSendOtp(email, name);

      // Set OTP cookie for short-lived verification
      const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 180_000),
        sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
        secure: process.env.NODE_ENV === "production",
      };

      res.cookie("otp", otpResult.token, cookieOptions);

      return res.status(201).json({
        message: userCheckResult.message,
        token: otpResult.token,
        userExists: false,
      });
    }

    return res.status(200).json(userCheckResult);
  };

  /**
   * POST /api/user/resendOtp
   */
  resendOtp = async (req: Request, res: Response, _next: NextFunction) => {
    const { email, name } = req.body;

    const result = await this._registrationService.generateAndSendOtp(email, name);

    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 180_000),
      sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
      secure: process.env.NODE_ENV === "production",
    };

    res.cookie("otp", result.token, cookieOptions);
    res.status(201).json(result);
  };


    /**
   * POST /api/user/checkLoginUser
   * Body: { mobile }
   */
  checkLoginUser = async (req: Request, res: Response, _next: NextFunction) => {
    const { mobile } = req.body;
    const result = await this._registrationService.authenticateUserByMobile(mobile);
     console.log("result",result);
     
            res.cookie("refreshToken", result.refreshToken, {
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                maxAge: 1000 * 60 * 60 * 24,
            });

    res.status(200).json(result);
  };

  /**
   * POST /api/user/checkGoogleLoginUser
   * Body: { email }
   */
  checkGoogleLoginUser = async (req: Request, res: Response, _next: NextFunction) => {
    const { email } = req.body;
    const result = await this._registrationService.authenticateUserByGoogle(email);
    res.status(200).json(result);
  };
}

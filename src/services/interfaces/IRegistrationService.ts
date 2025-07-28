import { UserData } from "../../dto/registrationServiceDTO";
import { ServiceResponse } from "../../dto/serviceResponse";

export interface IRegistrationService {
  user_registration(userData: UserData): Promise<ServiceResponse>;
  checkUser(mobile: string, email: string): Promise<ServiceResponse>;
}
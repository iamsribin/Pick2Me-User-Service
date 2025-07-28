import { IUser } from '../../interface/user.interface';

export interface RegistrationData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  referral_code: string;
  userImage?: string | null;
}

export interface IUserRepository {
  saveUser(userData: RegistrationData): Promise<IUser>;
  checkUser(mobile: string, email: string): Promise<IUser | null>;
  findUser(mobile: string): Promise<IUser | null>;
  findEmail(email: string): Promise<IUser | null>;
  findUserWithStatus(status: 'Good' | 'Block'): Promise<IUser[]>;
  findAndUpdate(id: string, status: 'Good' | 'Block'): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>;
  getUserDetails(id: string): Promise<IUser | null>;
  updateUserStatus(id: string, status: 'Good' | 'Block', reason: string): Promise<IUser | null>;
}

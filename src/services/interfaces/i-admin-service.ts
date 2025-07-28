import { IUserDto } from '../../dto/response/i-profile.dto';
import { IUpdateUserStatusGrpcResponse, UserListDTO } from '../../dto/response/admin-response.dto';

export interface IAdminService {
  getUserWithStatus(status: 'Good' | 'Block'): Promise<UserListDTO>;
  getUserDetails(id: string): Promise<IUserDto>;
  updateUserStatus(id: string, status: 'Good' | 'Block', reason: string): Promise<IUpdateUserStatusGrpcResponse>;
}
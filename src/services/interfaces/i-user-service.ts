import { IResponse } from '@Pick2Me/shared';
import { UserProfileDto } from '../../dto/response/user-response.dto';

export interface IUserService {
  fetchUserProfile(id: string): Promise<IResponse<UserProfileDto>>;
}

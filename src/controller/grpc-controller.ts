import { IUserService } from '@/services/interfaces/i-user-service';
import { TYPES } from '@/types/container-type';
import { UserInfo } from '@/types/user';
import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
import { inject, injectable } from 'inversify';

@injectable()
export class GrpcController {
  constructor(@inject(TYPES.UserService) private readonly _userService: IUserService) {}

  fetchUserInfoForBookingRide = async (
    call: ServerUnaryCall<{ userId: string }, UserInfo>,
    callback: sendUnaryData<UserInfo>
  ): Promise<void> => {
    try {
      console.log('reach', call.request.userId);

      const userInfo = await this._userService.fetchUserInfoForBookingRide(call.request.userId);
      console.log('response', userInfo);

      callback(null, userInfo);
    } catch (err) {
      console.log(err);
      throw new Error('Stripe account creation failed');
    }
  };
}

import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js";
import { IResponse } from "../../dto/request/user-response.dto";
import { UserProfileDto } from "../../dto/response/user-response.dto";

export interface IUserController {
  fetchUserProfile(
    call: ServerUnaryCall<{ id: string }, IResponse<UserProfileDto>>,
    callback: sendUnaryData<IResponse<UserProfileDto>>
  ): Promise<void>;
}

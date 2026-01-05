import { Coordinates, IResponse } from '@pick2me/shared/interfaces';
import { AvatarData, UserProfileDto } from '@/dto/response/user-response.dto';
import { SavedLocation } from '@/types/place-type';
import { UserInfo } from '@/types/user';

export interface IUserService {
  fetchProfile(id: string): Promise<IResponse<UserProfileDto>>;
  updateAvatar(avatarData: AvatarData): Promise<IResponse<null>>;
  updateName(nameUpdateData: { newName: string; id: string }): Promise<IResponse<null>>;
  fetchSavedPlaces(id: string): Promise<SavedLocation[]>;
  saveNewPlace(
    name: string,
    address: string,
    coordinates: Coordinates,
    userId: string
  ): Promise<void>;
  fetchUserInfoForBookingRide(userId: string): Promise<UserInfo>;
}

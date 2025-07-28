import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  mobile!: string;

  @Expose()
  user_image!: string;

  @Expose()
  referral_code!: string;

  @Expose()
  account_status!: string;

  @Expose()
  joining_date!: string;
}

import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  mobile!: string;

  @Expose({ name: 'user_image' })
  avatar!: string;

  @Expose({ name: 'account_status' })
  accountStatus!: 'Good' | 'Block';

  @Expose({ name: 'joining_date' })
  @Transform(({ value }) => (value ? new Date(value).toLocaleDateString() : value))
  joiningDate!: string;
}

// Pagination DTO
export class PaginationTransformerDto {
  @Expose()
  currentPage!: number;

  @Expose()
  totalPages!: number;

  @Expose()
  totalItems!: number;

  @Expose()
  itemsPerPage!: number;

  @Expose()
  hasNextPage!: boolean;

  @Expose()
  hasPreviousPage!: boolean;
}

// Original DTO for backward compatibility
export class UserListDTO {
  Users!: UserDto[];
}

// New paginated response DTO
export class PaginatedUserListDTO {
  @Expose()
  users!: UserDto[];

  @Expose()
  pagination!: PaginationTransformerDto;
}

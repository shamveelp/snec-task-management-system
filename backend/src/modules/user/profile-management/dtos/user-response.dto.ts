import { Expose, Exclude } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  username: string;

  @Expose()
  mobile: string | null;

  @Expose()
  profilePicture: string | null;

  @Expose()
  status: string;

  @Exclude()
  password?: string;

  @Exclude()
  hashedRefreshToken?: string;
  
  @Expose()
  organizationId: string | null;
  
  @Expose()
  roleId: string | null;
  
  @Expose()
  createdAt: Date;
  
  @Expose()
  updatedAt: Date;
}

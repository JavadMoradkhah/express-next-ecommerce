import { AdminRole } from '../enums/admin-role.enum';

export interface CreateAdminDto {
  username: string;
  email: string;
  password: string;
  role: AdminRole;
}

export interface UpdateAdminDto extends Partial<Pick<CreateAdminDto, 'email' | 'password'>> {}

export interface LoginAdminDto {
  username: string;
  password: string;
}

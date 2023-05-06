import { Role } from '../entities';

export interface CreateAdminDto {
  username: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateAdminDto extends Partial<Pick<CreateAdminDto, 'email' | 'password'>> {}

export interface LoginAdminDto {
  username: string;
  password: string;
}

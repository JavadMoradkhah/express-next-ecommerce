import { Role } from '../entities/admin.entity';

export interface SessionAdminUser {
  id: string;
  username: string;
  role: Role;
}

import { AdminRole } from "../enums/admin-role.enum";

export interface SessionAdminUser {
  id: string;
  username: string;
  role: AdminRole;
}

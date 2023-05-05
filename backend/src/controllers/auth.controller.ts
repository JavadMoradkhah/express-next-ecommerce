import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { adminsRepo } from '../repositories';
import { SessionAdminUser } from '../interfaces';

export const validateAdminCredentials = async (
  username: string,
  password: string
): Promise<SessionAdminUser | null> => {
  const admin = await adminsRepo.findOneBy({ username });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    return {
      id: admin.id,
      username: admin.username,
      role: admin.role,
    };
  }

  return null;
};

export const loginAdmin = async (req: Request) => {
  return req.user;
};

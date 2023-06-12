import * as bcrypt from 'bcrypt';
import { SessionAdminUser } from '../../interfaces';
import { adminsRepo } from '../../repositories';

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
  return null;
};

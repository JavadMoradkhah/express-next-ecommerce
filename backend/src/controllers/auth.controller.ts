import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { adminsRepo, usersRepo } from '../repositories';
import { SessionAdminUser } from '../interfaces';
import { CreateUserDto } from '../dto';
import { ConflictException } from '../common/exceptions';
import ErrorMessages from '../enums/error-messages.enum';

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

export const registerUser = async (createUserDto: CreateUserDto, res: Response) => {
  const userExists = await usersRepo.exist({ where: { email: createUserDto.email } });

  if (userExists) {
    throw new ConflictException(ErrorMessages.EMAIL_CONFLICT);
  }

  const user = usersRepo.create({
    firstName: createUserDto.firstName,
    lastName: createUserDto.lastName,
    email: createUserDto.email,
    password: createUserDto.password,
  });

  await usersRepo.save(user);

  return null;
};

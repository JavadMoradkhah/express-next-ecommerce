import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Request } from 'express';
import { adminsRepo, emailVerificationsRepo, usersRepo } from '../repositories';
import { SessionAdminUser } from '../interfaces';
import { CreateUserDto } from '../dto';
import { BadRequestException, ConflictException } from '../common/exceptions';
import { verifyToken } from '../common/app-utils';
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

  return await usersRepo.save(user);
};

export const verifyUser = async (token: string) => {
  try {
    const { sub } = await verifyToken(token, process.env.EMAIL_VERIFICATION_TOKEN_SECRET);

    const emailVerification = await emailVerificationsRepo.findOne({
      where: {
        user: {
          id: sub,
        },
      },
    });

    if (!emailVerification) {
      throw new BadRequestException(ErrorMessages.EMAIL_VERIFICATION_EXPIRED);
    }

    const now = new Date().getTime();

    if (now >= emailVerification.expiresIn.getTime()) {
      await emailVerificationsRepo.remove(emailVerification);
      throw new BadRequestException(ErrorMessages.EMAIL_VERIFICATION_EXPIRED);
    }

    await usersRepo.update({ id: sub }, { emailVerifiedAt: new Date() });
    await emailVerificationsRepo.remove(emailVerification);

    return 'OK';
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new BadRequestException(ErrorMessages.EMAIL_VERIFICATION_EXPIRED);
    }

    if (error instanceof JsonWebTokenError) {
      throw new BadRequestException(ErrorMessages.INVALID_EMAIL_VERIFICATION_LINK);
    }

    throw error;
  }
};

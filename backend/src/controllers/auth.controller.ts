import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { adminsRepo, emailVerificationsRepo, usersRepo } from '../repositories';
import { SessionAdminUser } from '../interfaces';
import { CreateUserDto } from '../dto';
import { BadRequestException, ConflictException } from '../common/exceptions';
import { verifyToken } from '../common/app-utils';
import ErrorMessages from '../enums/error-messages.enum';
import { User } from '../entities';

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

export const validateUserCredentials = async (
  email: string,
  password: string
): Promise<User | null> => {
  const user = await usersRepo.findOneBy({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return user;
  }

  return null;
};

export const loginAdmin = async (req: Request) => {
  return null;
};

export const loginUser = async (req: Request) => {
  return null;
};

export const registerUser = async (createUserDto: CreateUserDto) => {
  const userExists = await usersRepo.exist({ where: { email: createUserDto.email } });

  if (userExists) {
    throw new ConflictException(ErrorMessages.EMAIL_CONFLICT);
  }

  await usersRepo.save(
    usersRepo.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: createUserDto.password,
    })
  );

  return null;
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

    return null;
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

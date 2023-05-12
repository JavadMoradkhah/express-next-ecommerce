import { usersRepo } from '../repositories';
import { BadRequestException } from '../common/exceptions';
import ErrorMessages from '../enums/error-messages.enum';

export const findOrFail = async (id: string) => {
  const admin = await usersRepo.findOne({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  });

  if (!admin) {
    throw new BadRequestException(ErrorMessages.INVALID_USER_CREDENTIALS);
  }

  return admin;
};

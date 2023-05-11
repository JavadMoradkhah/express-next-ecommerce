import { adminsRepo } from '../repositories';
import { BadRequestException } from '../common/exceptions';
import ErrorMessages from '../enums/error-messages.enum';

export const findOrFail = async (id: string) => {
  const admin = await adminsRepo.findOne({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  if (!admin) {
    throw new BadRequestException(ErrorMessages.INVALID_USER_CREDENTIALS);
  }

  return admin;
};

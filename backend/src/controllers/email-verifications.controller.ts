import * as jwt from 'jsonwebtoken';
import { EmailVerification } from '../entities';
import { getVerificationUrl } from '../common/app-utils';
import { emailVerificationsRepo, usersRepo } from '../repositories';
import { AppDataSource } from '../config/database';
import { BadRequestException } from '../common/exceptions';
import ErrorMessages from '../enums/error-messages.enum';
import { VerificationDto } from '../dto';
import { emailQueue } from '../config/queue';

export const sendVerificationEmail = async (verificationDto: VerificationDto) => {
  const user = await usersRepo.findOneBy({ email: verificationDto.email });

  if (!user) {
    throw new BadRequestException(ErrorMessages.SIGNUP_REQUIRED_FOR_EMAIL_VERIFICATION);
  }

  if (user.emailVerifiedAt) {
    throw new BadRequestException(ErrorMessages.EMAIL_ALREADY_VERIFIED);
  }

  const token = jwt.sign({ sub: user.id }, process.env.EMAIL_VERIFICATION_TOKEN_SECRET, {
    expiresIn: '1h',
  });

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    await queryRunner.manager.delete(EmailVerification, {
      user: {
        id: user.id,
      },
    });

    await queryRunner.manager.save(
      emailVerificationsRepo.create({
        user: {
          id: user.id,
        },
        otp: token,
      })
    );

    await queryRunner.commitTransaction();

    await emailQueue.add('send-email', {
      from: 'E-Commerce',
      to: `${user.email}`,
      subject: 'Email Verification',
      html: `<div>
          <p>Click on the link below to verify your email address:</p>
          <a href="${getVerificationUrl(token)}">Verify</a>
      </div>`,
    });

    return 'A verification email was sent to your email address';
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

import * as jwt from 'jsonwebtoken';
import { transporter } from '../config/mail';
import { EmailVerification } from '../entities';
import { getVerificationUrl } from '../common/app-utils';
import { emailVerificationsRepo, usersRepo } from '../repositories';
import { AppDataSource } from '../config/database';
import { BadRequestException } from '../common/exceptions';
import ErrorMessages from '../enums/error-messages.enum';
import { error } from 'console';

export const sendVerificationEmail = async (email: string) => {
  const user = await usersRepo.findOneBy({ email });

  if (!user) {
    throw new BadRequestException(ErrorMessages.SIGNUP_REQUIRED_FOR_EMAIL_VERIFICATION);
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

    let info = await transporter.sendMail({
      from: '"E-Commerce" <foo@example.com>',
      to: `${user.email}, baz@example.com`,
      subject: 'Email Verification',
      // text: 'Hello world?',
      html: `<div>
          <p>Click on the link below to verify your email address:</p>
          <a href="${getVerificationUrl(token)}">Verify</a>
      </div>`,
    });

    return 'Message sent: ' + info.messageId;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

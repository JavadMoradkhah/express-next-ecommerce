import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { transporter } from '../config/mail';
import { EmailVerification } from '../entities';
import { getVerificationUrl } from '../common/app-utils';
import { emailVerificationsRepo, usersRepo } from '../repositories';
import { AppDataSource } from '../config/database';
import { BadRequestException } from '../common/exceptions';
import ErrorMessages from '../enums/error-messages.enum';
import { VerificationDto } from '../dto';
import { StatusCode } from '../enums/status-code.enum';
import { ResponsePayload } from '../interfaces/response-payload';

export const sendVerificationEmail = async (req: Request, res: Response) => {
  const verificationDto = req.body as VerificationDto;

  const user = await usersRepo.findOneBy({ email: verificationDto.email });

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

    console.log('Message sent: ' + info.messageId);

    res.status(StatusCode.OK).json({
      statusCode: StatusCode.OK,
      message: 'A verification email was sent to your email address',
    } as ResponsePayload);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
};

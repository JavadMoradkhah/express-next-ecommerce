import { AppDataSource } from '../config/database';
import { EmailVerification } from '../entities/email_verification.entity';

export const emailVerificationsRepo = AppDataSource.getRepository(EmailVerification);

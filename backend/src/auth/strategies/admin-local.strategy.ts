import { Strategy as LocalStrategy } from 'passport-local';
import { validateAdminCredentials } from '../../controllers/auth.controller';
import { UnauthorizedException } from '../../common/exceptions';
import { SessionAdminUser } from '../../interfaces';
import ErrorMessages from '../../enums/error-messages.enum';

export const name = 'ADMIN_LOCAL_STRATEGY';

export const strategy = new LocalStrategy(async (username: string, password: string, done) => {
  const admin: SessionAdminUser = await validateAdminCredentials(username, password);

  if (!admin) {
    return done(new UnauthorizedException(ErrorMessages.INVALID_USERNAME_OR_PASSWORD));
  }

  done(null, admin);
});

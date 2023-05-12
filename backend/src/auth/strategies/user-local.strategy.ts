import { Strategy as LocalStrategy } from 'passport-local';
import { validateUserCredentials } from '../../controllers/auth.controller';
import { UnauthorizedException } from '../../common/exceptions';
import { SessionUser } from '../../interfaces';
import ErrorMessages from '../../enums/error-messages.enum';

export const name = 'USER_LOCAL_STRATEGY';

export const strategy = new LocalStrategy(
  { usernameField: 'email' },
  async (email: string, password: string, done) => {
    const user = await validateUserCredentials(email, password);

    if (!user) {
      return done(new UnauthorizedException(ErrorMessages.INVALID_EMAIL_OR_PASSWORD));
    }

    if (!user.emailVerifiedAt) {
      return done(new UnauthorizedException(ErrorMessages.EMAIL_VERIFICATION_REQUIRED));
    }

    const sessionUser: SessionUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    done(null, sessionUser);
  }
);

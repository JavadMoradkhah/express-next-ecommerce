import * as jwt from 'jsonwebtoken';

const getScheme = (): string => {
  return process.env.NODE_ENV === 'production' ? 'https://' : 'http://';
};

export const getServerUrl = (): string => {
  const scheme = getScheme();
  const host = process.env.SERVER_HOST;
  return `${scheme}${host}`;
};

export const getClientUrl = (): string => {
  const scheme = getScheme();
  const host = process.env.CLIENT_HOST;
  return `${scheme}${host}`;
};

export const getVerificationUrl = (token: string): string => {
  const url = getClientUrl();
  const VerificationUrl = process.env.MAIL_VERIFICATION_URL;
  return `${url}${VerificationUrl}${token}`;
};

export const verifyToken = (token: string, secret: string): Promise<jwt.JwtPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      resolve(decoded as jwt.JwtPayload);
    });
  });
};

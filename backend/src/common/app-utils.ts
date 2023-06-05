import * as jwt from 'jsonwebtoken';
import appConfig from '../config/app';

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

export const getPaginationParams = (page?: string) => {
  const itemsPerPage = appConfig.pagination.itemsPerAdminPage;

  return {
    take: itemsPerPage,
    skip: ((+page || 1) - 1) * itemsPerPage,
  };
};

export const calculateTotalPages = (totalItems: number, limit: number) => {
  return Math.ceil(totalItems / limit);
};

export const getPaginatedResponse = (
  data: any[],
  totalItems: number,
  page: string,
  itemsPerPage: number
) => {
  return {
    data: data,
    pagination: {
      total_items: totalItems,
      current_page: +page || 1,
      total_pages: calculateTotalPages(totalItems, itemsPerPage),
    },
  };
};

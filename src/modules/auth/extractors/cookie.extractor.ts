import { Request } from 'express';
import { ACCESS_TOKEN_COOKIE_NAME } from 'modules/auth/auth.constants';

export const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.signedCookies) {
    token = req.signedCookies[ACCESS_TOKEN_COOKIE_NAME];
  }
  return token;
};

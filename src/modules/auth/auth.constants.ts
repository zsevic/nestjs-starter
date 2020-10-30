import { CookieOptions } from 'express';

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  // secure: true,
  signed: true,
};

export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

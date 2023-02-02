import { sign, verify } from 'jsonwebtoken';
import { Actor, Role } from '../models/Actor';

export type LoginResponse = {
  token?: string;
  _id?: string;
  errorMsg?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AccessTokenPaylod = {
  _id: string;
  role: Role;
};

export type RefreshTokenPayload = {
  _id: string;
};

export const createAcesstoken = (actor: Actor): string => {
  return sign(
    { id: actor._id, role: actor.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '15m',
    }
  );
};

export const createRefreshToken = (id: string): string => {
  return sign({ id: id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyAcessToken = (token: string): AccessTokenPaylod | null => {
  try {
    token = token.split(' ')[1];
    return verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (
  token: string
): RefreshTokenPayload | null => {
  try {
    token = token.split(' ')[1];
    return verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    return null;
  }
};

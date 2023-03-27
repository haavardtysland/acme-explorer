import { sign, verify } from 'jsonwebtoken';
import { Actor, Role } from '../models/Actor';

export type LoginResponse = {
  token?: string;
  id?: string;
  errorMsg?: string;
  actor?: Actor; 
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AccessTokenPaylod = {
  id: string;
  role: Role;
};

export type RefreshTokenPayload = {
  id: string;
};

export const createAcesstoken = (actor: Actor): string => {
  return sign(
    { id: actor._id, role: actor.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '60m',
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

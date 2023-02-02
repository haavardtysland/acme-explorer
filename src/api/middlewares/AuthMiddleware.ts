import { Role } from '../models/Actor';
import { Request, Response, NextFunction } from 'express';
import { AccessTokenPaylod, verifyAcessToken } from '../auth/auth';

export const isAuthorized = (permissions?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;
    if (authHeader == undefined) {
      return res
        .status(401)
        .send('You need to provide a bearer token as AUTHORIZATION header');
    }
    const payload: AccessTokenPaylod | null = verifyAcessToken(authHeader);
    if (!payload) {
      return res.status(401).send('Access token is not valid');
    }

    if (!permissions || permissions.length < 1) {
      return next();
    }

    if (!permissions.includes(payload.role)) {
      return res.status(403).send(`User needs role: ${permissions}`);
    }
    next();
  };
};

export const verifyIdentity = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const actorId = req.params.actorId;
  const authHeader: string | undefined = req.headers.authorization;
  if (authHeader == undefined) {
    return res
      .status(401)
      .send('You need to provide a bearer token as AUTHORIZATION header');
  }
  const payload: AccessTokenPaylod | null = verifyAcessToken(authHeader);

  if (!payload) {
    return res.status(401).send('Access token is not valid');
  }

  if (payload._id !== actorId) {
    return res
      .status(401)
      .send('Token do not belong to user you are trying to DELETE/UPDATE');
  }
  next();
};

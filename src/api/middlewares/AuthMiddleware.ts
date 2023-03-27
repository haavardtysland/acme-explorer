import { NextFunction, Request, Response } from 'express';
import { AccessTokenPaylod, verifyAcessToken } from '../auth/auth';
import { Role } from '../models/Actor';

export const isAuthorized = (permissions?: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;
    if (authHeader == undefined) {
      return res
        .status(401)
        .send('You need to provide a bearer token in AUTHORIZATION header');
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
    res.locals.actorId = payload.id;
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

  if (payload.id !== actorId) {
    return res
      .status(401)
      .send('Token do not belong to user you are trying to DELETE/UPDATE');
  }
  next();
};

export const getUserInfo = (
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
  
  if(payload.role == Role.Administrator) {
    return next(); 
  }

  if (payload.id !== actorId) {
    return res
      .status(401)
      .send('Token do not belong to user you are trying to DELETE/UPDATE or the user is not Administrator');
  }
  next();
};



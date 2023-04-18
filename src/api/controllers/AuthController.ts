import { compare } from 'bcryptjs';
import { Request, Response } from 'express';
import {
  createAcesstoken,
  createRefreshToken,
  LoginRequest,
  LoginResponse,
  RefreshTokenPayload,
  verifyRefreshToken,
} from '../auth/auth';
import {
  ErrorResponse,
  isErrorResponse,
} from '../error_handling/ErrorResponse';
import { Actor } from '../models/Actor';
import { ActorRepository } from '../repository/ActorRepository';
import { loginValidator } from './validators/LoginValidator';
import Validator from './validators/Validator';

export const login = async (req: Request, res: Response) => {
  const loginRequest: LoginRequest = req.body;

  const validate = Validator.compile<LoginRequest>(loginValidator);
  if (!validate(loginRequest)) {
    return res.status(400).send(validate.errors);
  }

  const actor = await ActorRepository.getUserByEmail(loginRequest.email);
  if (isErrorResponse(actor)) {
    return res.status(500).send(actor.errorMessage);
  }

  if (!actor) {
    return res
      .status(404)
      .send(`Could not find user with email: ${loginRequest.email}`);
  }
  if (actor?.isBanned) {
    return res.status(401).send('This user is banned');
  }

  const valid: boolean = await compare(loginRequest.password, actor.password);
  if (!valid) {
    const response: LoginResponse = {
      errorMsg: 'Wrong password',
    };
    return res.status(401).send(response);
  }

  const response: LoginResponse = {
    id: actor._id,
    token: createAcesstoken(actor),
    actor: actor,
  };
  res.header('Access-Control-Allow-Credentials', 'true');
  res.cookie('rt', createRefreshToken(actor._id), {
    sameSite: 'none',
    secure: true,
  });
  return res.status(200).send(response);
};

export const useRefreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.rt;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }
  console.log(token);
  const payload: RefreshTokenPayload | null = verifyRefreshToken(token);
  console.log(payload);
  if (!payload) {
    return res.status(401).send('User is not authenticated.');
  }

  const actor: Actor | null | ErrorResponse = await ActorRepository.getActor(
    payload.id
  );

  if (actor == null) {
    return res.status(404).send(`Cannot find User with _id: ${payload.id}`);
  }
  if (isErrorResponse(actor)) {
    return res.status(500).send(actor.errorMessage);
  }

  res.cookie('rt', createRefreshToken(actor._id), {
    sameSite: 'none',
    secure: true,
  });

  return res.send({
    ok: true,
    accessToken: createAcesstoken(actor),
    actor: actor,
  });
};

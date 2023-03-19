import { compare } from 'bcryptjs';
import { Request, Response } from 'express';
import {
  createAcesstoken,
  createRefreshToken,
  LoginRequest,
  LoginResponse,
  RefreshTokenPayload,
  verifyAcessToken,
} from '../auth/auth';
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
  };
  return res.status(200).send(response);
};

export const useRefreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.rt;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  const payload: RefreshTokenPayload | null = verifyAcessToken(token);

  if (!payload) {
    return res.send(401).send('User is not authenticated.');
  }

  const actor: Actor | null = await ActorRepository.getActor(payload.id);

  if (actor == null) {
    return res.status(404).send(`Cannot find User with _id: ${payload.id}`);
  }

  res.cookie('rt', createRefreshToken(actor._id), {
    httpOnly: true,
    path: 'refresh-token',
  });

  return res.send({
    ok: true,
    accessToken: createAcesstoken(actor),
  });
};

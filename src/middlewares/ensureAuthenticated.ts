import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { AppError } from '../errors/AppError';
import { env } from '../env';

import { PrismaUsersRepository } from '../repositories/prisma/PrismaUsersRepository';

interface IPayload {
  sub: string;
}

async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(token, env.JWT_SECRET) as IPayload;

    const usersRepository = new PrismaUsersRepository();
    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User does not exists', 401);
    }

    request.user = {
      id: userId,
    };

    return next();
  } catch {
    throw new AppError('Invalid token', 401);
  }
}

export { ensureAuthenticated };
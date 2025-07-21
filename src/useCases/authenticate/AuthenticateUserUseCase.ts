import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import { env } from '../../env';

import { AppError } from '../../errors/AppError';

import { IUsersRepository } from '../../repositories/IUsersRepository';

type AuthenticateUserUseCaseRequest = {
  email: string;
  password: string;
};

export class AuthenticateUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute({ 
    email, 
    password 
    }: AuthenticateUserUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists', 404);
    }

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new AppError('User or Password incorrect', 400);
    }

    const token = sign({}, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: '1d',
    });

    return {
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}
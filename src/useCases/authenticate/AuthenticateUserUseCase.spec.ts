import { beforeEach, describe, expect, it, vi } from 'vitest';
import { hash } from 'bcryptjs';

import { InMemoryUsersRepository } from '../../repositories/inMemory/InMemoryUsersRepository';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';
import { AppError } from '../../errors/AppError';

vi.mock('../../env', () => ({
  env: {
    JWT_SECRET: 'mock-jwt-secret',
  },
}));

describe('Authenticate User Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: AuthenticateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AuthenticateUserUseCase(usersRepository);
  });

  it('should be able to authenticate with correct credentials', async () => {
    await usersRepository.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: await hash('secure-password', 8),
    });

    const { user, token } = await sut.execute({
      email: 'jane@example.com',
      password: 'secure-password',
    });

    expect(user.email).toBe('jane@example.com');
    expect(token).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with non-existing user', async () => {
    await expect(() =>
      sut.execute({
        email: 'unknown@example.com',
        password: 'password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'Jake Doe',
      email: 'jake@example.com',
      password: await hash('correct-password', 8),
    });

    await expect(() =>
      sut.execute({
        email: 'jake@example.com',
        password: 'wrong-password',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
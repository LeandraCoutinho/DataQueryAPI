import { beforeEach, describe, expect, it } from 'vitest';
import { compare } from 'bcryptjs';

import { InMemoryUsersRepository } from '../../repositories/inMemory/InMemoryUsersRepository';
import { CreateUserUseCase } from './CreateUserUseCase';
import { AppError } from '../../errors/AppError';

let usersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;

describe('Create User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(usersRepository);
  });

  it('should create a new user with hashed password', async () => {
    const request = {
      name: 'John Joe',
      email: 'john@example.com',
      password: '123456',
    };

    await sut.execute(request);

    const createdUser = await usersRepository.findByEmail(request.email);

    expect(createdUser).toBeDefined();
    expect(createdUser?.name).toBe('John Joe');
    expect(createdUser?.email).toBe('john@example.com');
    const isPasswordHashed = await compare('123456', createdUser!.passwordHash);
    expect(isPasswordHashed).toBe(true);
  });

  it('should throw if email is already in use', async () => {
    const request = {
      name: 'John Joe',
      email: 'john@example.com',
      password: '123456',
    };

    await sut.execute(request);

    await expect(() => sut.execute(request)).rejects.toBeInstanceOf(AppError);
  });
});
import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryUsersRepository } from '../../repositories/inMemory/InMemoryUsersRepository';
import { FindUserUseCase } from './FindUserUseCase';
import { AppError } from '../../errors/AppError';

let usersRepository: InMemoryUsersRepository;
let sut: FindUserUseCase;

describe('Find User Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new FindUserUseCase(usersRepository);
  });

  it('should find a user by ID and not return passwordHash', async () => {
    await usersRepository.create({
      name: 'John Joe',
      email: 'john@example.com',
      password: 'hashed-password',
    });

    const createdUser = await usersRepository.findByEmail('john@example.com');

    const foundUser = await sut.execute(createdUser!.id);

    expect(foundUser).toBeDefined();
    expect(foundUser.id).toBe(createdUser!.id);
    expect(foundUser.email).toBe(createdUser!.email);
    expect('passwordHash' in foundUser).toBe(false);
  });

  it('should throw if user is not found', async () => {
    await expect(() => sut.execute('non-existent-id')).rejects.toBeInstanceOf(AppError);
  });
});
import { AppError } from '../../errors/AppError';

import { IUsersRepository } from '../../repositories/IUsersRepository';

export class FindUserUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async execute(id: string) {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User not found in database', 404);
    }

    delete (user as any).passwordHash;

    return user;
  }
}
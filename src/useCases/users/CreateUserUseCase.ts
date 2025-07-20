import { hash } from 'bcryptjs';

import { AppError } from '../../errors/AppError';
import { IUsersRepository } from '../../repositories/IUsersRepository';

type CreateUserUseCaseRequest = {
    name: string;
    email: string;
    password: string;
};

export class CreateUserUseCase {
    constructor(
        private readonly usersRepository: IUsersRepository
    ) {}

    async execute({
        name,
        email,
        password
    }: CreateUserUseCaseRequest) {
        const userByEmail = await this.usersRepository.findByEmail(email);

        if (userByEmail) {
            throw new AppError('Email já está em uso');
        }

        const passwordHash = await hash(password, 8);

        await this.usersRepository.create({
            name, 
            email,
            password: passwordHash,
        });
    }
}
import {
    CreateUserData,
    IUsersRepository
} from '../IUsersRepository';

import { prisma } from '../../prisma';
import { User } from '@prisma/client';

export class PrismaUsersRepository implements IUsersRepository {
    async create(data: CreateUserData): Promise<void> {
        await prisma.user.create({ 
            data: {
                name: data.name,
                email: data.email,
                passwordHash: data.password,
            },
        });
    };

    async findById(id: string) {
        const user = await prisma.user.findFirst({
            where: { id },
        });

        return user;
    };

    async findByEmail(email: string) {
        const user = await prisma.user.findFirst({
            where: { email },
        });

        return user;
    };
};
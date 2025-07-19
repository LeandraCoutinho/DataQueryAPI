import { User } from '@prisma/client';

export type CreateUserData = {
    name: string;
    email: string;
    password: string;
};

export interface IUsersRepository {
    create(data: CreateUserData): Promise<void>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}
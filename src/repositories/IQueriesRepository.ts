import { Query } from '@prisma/client';

export type CreateQueryData = {
    userId: string;
    question: string;
    answer: string;
}

export interface IQueriesRepository {
    create(data: CreateQueryData): Promise<void>;
    findAll(userId: string): Promise<Query[]>;
}
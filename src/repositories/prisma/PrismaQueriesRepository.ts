import {
    CreateQueryData,
    IQueriesRepository
} from '../IQueriesRepository';

import { prisma } from '../../prisma';
import { Query } from '@prisma/client';

export class PrismaQueriesRepository implements IQueriesRepository {
    async create(data: CreateQueryData) {
        await prisma.query.create({
            data: {
                userId: data.userId,
                question: data.question,
                answer: data.answer
            },
        });
    }

    async findAll(userId: string): Promise<Query[]> {
        const queries = await prisma.query.findMany({
            where: { userId },
        });

        return queries;
    }
}
import { IQueriesRepository } from '../../repositories/IQueriesRepository';

import { AppError } from '../../errors/AppError';

export class ListQueriesUseCase {
    constructor(private readonly queriesRepository: IQueriesRepository) {}

    async execute(userId: string) {
        const queries = await this.queriesRepository.findAll(userId);

        if (queries.length == 0) {
            throw new AppError('User has no queries', 404);
        }

        return queries;
    }
} 

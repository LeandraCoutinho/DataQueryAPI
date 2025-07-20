import { AppError } from '../../errors/AppError';
import { IDatasetsRepository } from '../../repositories/IDatasetsRepository';

export class ListDatasetsByUserUseCase {
    constructor(private readonly datasetsRepository: IDatasetsRepository) {}
    async execute(userId: string) {
        const datasets = await this.datasetsRepository.findAll(userId);

        if (!datasets || datasets.length == 0) {
            throw new AppError('User does not have a registered dataset', 404)
        }

        return datasets;
    };
}
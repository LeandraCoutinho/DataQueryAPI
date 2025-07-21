import { AppError } from '../../errors/AppError';

import { IDatasetsRepository } from '../../repositories/IDatasetsRepository';

export class ListRecordsByDatasetUseCase {
    constructor(private readonly datasetsRepository: IDatasetsRepository) {}
    async execute(userId: string, datasetId: string) {
        const dataset = await this.datasetsRepository.findById(datasetId);

        if (!dataset) {
            throw new AppError('Dataset not found or not owned by user', 404);
        }

        if (dataset.userId !== userId){
            throw new AppError('User does not have access to this dataset', 403);
        }

        const records = await this.datasetsRepository.findRegistersByDataset(datasetId);

        if (!records || records.length == 0) {
            throw new AppError('User has no registered records', 404)
        }

        return records;
    };
}
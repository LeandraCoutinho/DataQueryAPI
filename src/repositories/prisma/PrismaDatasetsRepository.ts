import {
    CreateDatasetData,
    IDatasetsRepository
} from '../IDatasetsRepository';

import { prisma } from '../../prisma';

export class PrismaDatasetsRepository implements IDatasetsRepository {
    async create(data: CreateDatasetData) {
        const dataset = await prisma.dataset.create({
            data: {
                name: data.name,
                userId: data.userId,
                size: data.size
            },
        });

        return dataset;
    };
};
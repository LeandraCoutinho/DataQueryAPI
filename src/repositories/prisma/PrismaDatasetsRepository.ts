import {
    CreateDatasetData,
    IDatasetsRepository
} from '../IDatasetsRepository';

import { prisma } from '../../prisma';
import { Dataset, Record } from '@prisma/client';

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

    async findAll(userId: string): Promise<Dataset[]> {
        const datasets = await prisma.dataset.findMany({
            where: { userId }
        });

        return datasets;
    };

    async findRegistersByDataset(datasetId: string): Promise<Record[]> {
        const records = await prisma.record.findMany({
            where: { datasetId },
        });

        return records;
    };

    async findById(id: string): Promise<Dataset | null> {
        const dataset = await prisma.dataset.findUnique({
            where: { id } 
        });

        return dataset;
    }
};
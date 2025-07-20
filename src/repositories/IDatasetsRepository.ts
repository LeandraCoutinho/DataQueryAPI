import { Dataset, Record } from '@prisma/client';

export type CreateDatasetData = {
    name: string;
    userId: string;
    size: number;
}

export interface IDatasetsRepository {
    create(data: CreateDatasetData): Promise<Dataset>;
    findAll(userId: string): Promise<Dataset[]>;
    findRegistersByDataset(datasetId: string): Promise<Record[]>
    findById(id: string): Promise<Dataset | null>;
}
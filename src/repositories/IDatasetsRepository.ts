import { Dataset } from '@prisma/client';

export type CreateDatasetData = {
    name: string;
    userId: string;
    size: number;
}

export interface IDatasetsRepository {
    create(data: CreateDatasetData): Promise<Dataset>;
}
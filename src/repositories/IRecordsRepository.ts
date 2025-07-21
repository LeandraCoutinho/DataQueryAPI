import { Record } from '@prisma/client';

export type CreateRecordData = {
    datasetId: string;
    content: any[];
}

export interface IRecordsRepository {
    create(data: CreateRecordData): Promise<void>;
    searchByKeyword(query: string, userId: string): Promise<Record[]>;
    findByDatasetId(datasetId: string): Promise<Record[]>
}
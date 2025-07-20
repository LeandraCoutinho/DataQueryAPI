import { Record } from '@prisma/client';

export type CreateRecordData = {
    datasetId: string;
    content: any[];
}

export interface IRecordsRepository {
    create(data: CreateRecordData): Promise<void>;
    searchByKeyword(query: string): Promise<Record[]>;
}
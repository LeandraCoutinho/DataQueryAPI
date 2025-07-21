import {
    CreateRecordData,
    IRecordsRepository
} from '../IRecordsRepository';

import { prisma } from '../../prisma';

import { Record } from '@prisma/client';

export class PrismaRecordsRepository implements IRecordsRepository {
    async create({ datasetId, content }: CreateRecordData): Promise<void> {
        await prisma.record.createMany({
        data: content.map((item) => ({
            datasetId,
            dataJson: JSON.stringify(item),
            })),
        });
    }

    async searchByKeyword(query: string): Promise<Record[]> {
        return prisma.record.findMany({
        where: {
            dataJson: {
                contains: query,
                mode: 'insensitive', 
            },
        },
        });
    }

    async findByDatasetId(datasetId: string): Promise<Record[]> {
        return prisma.record.findMany({
            where: { datasetId },
        });
    }
}
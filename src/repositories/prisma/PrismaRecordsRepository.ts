import {
    CreateRecordData,
    IRecordsRepository
} from '../IRecordsRepository';

import { prisma } from '../../prisma';

export class PrismaRecordsRepository implements IRecordsRepository {
    async create({ datasetId, content }: CreateRecordData): Promise<void> {
        await prisma.record.createMany({
        data: content.map((item) => ({
            datasetId,
            dataJson: JSON.stringify(item),
            })),
        });
    }
}
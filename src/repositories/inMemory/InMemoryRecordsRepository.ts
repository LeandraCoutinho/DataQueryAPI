import { CreateRecordData, IRecordsRepository } from '../IRecordsRepository';
import { Record } from '@prisma/client';

export class InMemoryRecordsRepository implements IRecordsRepository {
  public records: Record[] = [];

  async create({ datasetId, content }: CreateRecordData): Promise<void> {
    const newRecords: Record[] = content.map((item, index) => ({
      id: `record-${this.records.length + index + 1}`,
      datasetId,
      dataJson: JSON.stringify(item),
      createdAt: new Date(),
    }));

    this.records.push(...newRecords);
  }

  async searchByKeyword(query: string): Promise<Record[]> {
    return this.records.filter((record) =>
      record.dataJson.toLowerCase().includes(query.toLowerCase())
    );
  }

  async findByDatasetId(datasetId: string): Promise<Record[]> {
    return this.records.filter((record) => record.datasetId === datasetId);
  }
}
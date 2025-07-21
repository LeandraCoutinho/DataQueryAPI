import { CreateDatasetData, IDatasetsRepository } from '../IDatasetsRepository';
import { Dataset, Record } from '@prisma/client';

export class InMemoryDatasetsRepository implements IDatasetsRepository {
  public datasets: Dataset[] = [];
  public records: Record[] = [];

  async create(data: CreateDatasetData): Promise<Dataset> {
    const dataset: Dataset = {
      id: `dataset-${this.datasets.length + 1}`,
      name: data.name,
      userId: data.userId,
      size: data.size,
      createdAt: new Date(),
    };

    this.datasets.push(dataset);
    return dataset;
  }

  async findAll(userId: string): Promise<Dataset[]> {
    return this.datasets.filter((d) => d.userId === userId);
  }

  async findRegistersByDataset(datasetId: string): Promise<Record[]> {
    return this.records.filter((r) => r.datasetId === datasetId);
  }

  async findById(id: string): Promise<Dataset | null> {
    const dataset = this.datasets.find((d) => d.id === id);
    return dataset ?? null;
  }
}
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryDatasetsRepository } from '../../repositories/inMemory/InMemoryDatasetsRepository';
import { ListRecordsByDatasetUseCase } from './ListRecordsByDatasetUseCase';

let datasetsRepository: InMemoryDatasetsRepository;
let sut: ListRecordsByDatasetUseCase;

describe('List Records By Dataset Use Case', () => {
  beforeEach(() => {
    datasetsRepository = new InMemoryDatasetsRepository();
    sut = new ListRecordsByDatasetUseCase(datasetsRepository);
  });

  it('should return all records from a dataset owned by the user', async () => {
    const dataset = await datasetsRepository.create({
      name: 'My Dataset',
      size: 10,
      userId: 'user-1',
    });

    datasetsRepository.records.push({
      id: 'record-1',
      datasetId: dataset.id,
      dataJson: JSON.stringify({ field: 'value' }),
      createdAt: new Date(),
    });

    const result = await sut.execute('user-1', dataset.id);

    expect(result).toHaveLength(1);
    expect(result[0].datasetId).toBe(dataset.id);
  });

  it('should throw if dataset does not exist', async () => {
    await expect(() =>
      sut.execute('user-1', 'non-existent-dataset')
    ).rejects.toThrow('Dataset not found or not owned by user');
  });

  it('should throw if dataset does not belong to user', async () => {
    const dataset = await datasetsRepository.create({
      name: 'Another Dataset',
      size: 5,
      userId: 'user-2',
    });

    await expect(() =>
      sut.execute('user-1', dataset.id)
    ).rejects.toThrow('User does not have access to this dataset');
  });

  it('should throw if dataset has no records', async () => {
    const dataset = await datasetsRepository.create({
      name: 'Empty Dataset',
      size: 0,
      userId: 'user-1',
    });

    await expect(() =>
      sut.execute('user-1', dataset.id)
    ).rejects.toThrow('User has no registered records');
  });
});
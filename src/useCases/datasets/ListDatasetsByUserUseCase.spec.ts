import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryDatasetsRepository } from '../../repositories/inMemory/InMemoryDatasetsRepository';
import { ListDatasetsByUserUseCase } from './ListDatasetsByUserUseCase';
import { AppError } from '../../errors/AppError';

let datasetsRepository: InMemoryDatasetsRepository;
let sut: ListDatasetsByUserUseCase;

describe('List Datasets By User Use Case', () => {
  beforeEach(() => {
    datasetsRepository = new InMemoryDatasetsRepository();
    sut = new ListDatasetsByUserUseCase(datasetsRepository);
  });

  it('should return all datasets from a user', async () => {
    await datasetsRepository.create({
      name: 'Dataset A',
      size: 123,
      userId: 'user-1',
    });

    await datasetsRepository.create({
      name: 'Dataset B',
      size: 456,
      userId: 'user-1',
    });

    const result = await sut.execute('user-1');

    expect(result).toHaveLength(2);
    expect(result[0].userId).toBe('user-1');
  });

  it('should throw if the user has no datasets', async () => {
    await expect(() => sut.execute('non-existent-user')).rejects.toBeInstanceOf(AppError);
  });
});
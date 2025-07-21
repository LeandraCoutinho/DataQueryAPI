import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryRecordsRepository } from '../../repositories/inMemory/InMemoryRecordsRepository';
import { SearchRecordsUseCase } from './SearchRecordsUseCase';
import { AppError } from '../../errors/AppError';

let recordsRepository: InMemoryRecordsRepository;
let sut: SearchRecordsUseCase;

describe('Search Records Use Case', () => {
  beforeEach(() => {
    recordsRepository = new InMemoryRecordsRepository();
    sut = new SearchRecordsUseCase(recordsRepository);
  });

  it('should return matching records by keyword', async () => {
    recordsRepository.records.push(
      {
        id: 'rec-1',
        datasetId: 'ds-1',
        dataJson: JSON.stringify({ text: 'Artificial Intelligence and AI' }),
        createdAt: new Date(),
      },
      {
        id: 'rec-2',
        datasetId: 'ds-1',
        dataJson: JSON.stringify({ text: 'Machine Learning basics' }),
        createdAt: new Date(),
      }
    );

    const result = await sut.execute('AI');

    expect(result).toHaveLength(1);
    expect(JSON.parse(result[0].dataJson).text).toContain('Artificial Intelligence');
  });

  it('should throw an error if query is empty', async () => {
    await expect(() => sut.execute('')).rejects.toBeInstanceOf(AppError);

    await expect(() => sut.execute('   ')).rejects.toBeInstanceOf(AppError);
  });
});
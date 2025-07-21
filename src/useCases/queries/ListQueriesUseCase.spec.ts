import { beforeEach, describe, expect, it } from 'vitest';

import { InMemoryQueriesRepository } from '../../repositories/inMemory/InMemoryQueriesRepository';
import { ListQueriesUseCase } from './ListQueriesUseCase';
import { AppError } from '../../errors/AppError';

let queriesRepository: InMemoryQueriesRepository;
let sut: ListQueriesUseCase;

describe('List Queries Use Case', () => {
  beforeEach(() => {
    queriesRepository = new InMemoryQueriesRepository();
    sut = new ListQueriesUseCase(queriesRepository);
  });

  it('should return a list of queries for the user', async () => {
    queriesRepository.queries.push(
      {
        id: 'query-1',
        userId: 'user-1',
        question: 'What is AI?',
        answer: 'Artificial Intelligence',
        createdAt: new Date(),
      },
      {
        id: 'query-2',
        userId: 'user-1',
        question: 'What is ML?',
        answer: 'Machine Learning',
        createdAt: new Date(),
      }
    );

    const result = await sut.execute('user-1');

    expect(result).toHaveLength(2);
    expect(result[0].question).toBe('What is AI?');
    expect(result[1].question).toBe('What is ML?');
  });

  it('should throw if user has no queries', async () => {
    await expect(() => sut.execute('user-2')).rejects.toBeInstanceOf(AppError);
  });
});

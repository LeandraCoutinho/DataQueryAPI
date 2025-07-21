import { beforeEach, describe, expect, it, vi } from 'vitest';

import { InMemoryRecordsRepository } from '../../repositories/inMemory/InMemoryRecordsRepository';
import { InMemoryQueriesRepository } from '../../repositories/inMemory/InMemoryQueriesRepository';
import { AskQuestionUseCase } from './AskQuestionUseCase';

vi.mock('../../llm/query', () => ({
  answerWithRAG: vi.fn().mockResolvedValue({ result: 'mocked answer' })
}));

let recordsRepository: InMemoryRecordsRepository;
let queriesRepository: InMemoryQueriesRepository;
let sut: AskQuestionUseCase;

describe('Ask Question Use Case', () => {
  beforeEach(() => {
    recordsRepository = new InMemoryRecordsRepository();
    queriesRepository = new InMemoryQueriesRepository();
    sut = new AskQuestionUseCase(recordsRepository, queriesRepository);
  });

  it('should answer a question based on dataset records', async () => {
    recordsRepository.records.push({
      id: 'record-1',
      datasetId: 'dataset-1',
      dataJson: JSON.stringify({ text: 'example data' }),
      createdAt: new Date(),
    });

    const answer = await sut.execute({
      datasetId: 'dataset-1',
      question: 'What is the example?',
      userId: 'user-1',
    });

    expect(answer).toEqual({ result: 'mocked answer' });
    expect(queriesRepository.queries).toHaveLength(1);
    expect(queriesRepository.queries[0].question).toBe('What is the example?');
  });

  it('should throw if dataset has no records', async () => {
    await expect(() =>
      sut.execute({
        datasetId: 'dataset-empty',
        question: 'Any question?',
        userId: 'user-2',
      })
    ).rejects.toThrow('Dataset not found');
  });
});
import { beforeEach, describe, expect, it, vi } from 'vitest';
import fs from 'fs/promises';
import path from 'path';

import { InMemoryDatasetsRepository } from '../../repositories/inMemory/InMemoryDatasetsRepository';
import { InMemoryRecordsRepository } from '../../repositories/inMemory/InMemoryRecordsRepository';
import { UploadUseCase } from './UploadUseCase';
import { AppError } from '../../errors/AppError';

vi.mock('fs/promises');
vi.mock('csvtojson', async () => ({
  default: () => ({ fromFile: async () => [{ name: 'Example' }] })
}));
vi.mock('pdf-parse', async () => ({
  default: async () => ({ text: 'PDF content text' })
}));

let datasetsRepository: InMemoryDatasetsRepository;
let recordsRepository: InMemoryRecordsRepository;
let sut: UploadUseCase;

const mockFilePath = path.resolve(__dirname, 'mock.csv');

describe('Upload Use Case', () => {
  beforeEach(() => {
    datasetsRepository = new InMemoryDatasetsRepository();
    recordsRepository = new InMemoryRecordsRepository();
    sut = new UploadUseCase(datasetsRepository, recordsRepository);
  });

  it('should process and store records from CSV file', async () => {
    await sut.execute({
      name: 'test.csv',
      userId: 'user-1',
      size: 1,
      filePath: mockFilePath,
    });

    expect(datasetsRepository.datasets).toHaveLength(1);
    expect(recordsRepository.records).toHaveLength(1);
  });

  it('should process and store records from PDF file', async () => {
    (fs.readFile as unknown as any).mockResolvedValue(Buffer.from('PDF buffer'));

    await sut.execute({
      name: 'document.pdf',
      userId: 'user-2',
      size: 1,
      filePath: mockFilePath,
    });

    expect(datasetsRepository.datasets).toHaveLength(1);
    expect(recordsRepository.records).toHaveLength(1);
    expect(JSON.parse(recordsRepository.records[0].dataJson).text).toBe('PDF content text');
  });

  it('should throw if file extension is not supported', async () => {
    await expect(() =>
      sut.execute({
        name: 'file.txt',
        userId: 'user-3',
        size: 1,
        filePath: mockFilePath,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
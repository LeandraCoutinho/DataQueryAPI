import { AppError } from '../../errors/AppError';

import { IRecordsRepository } from '../../repositories/IRecordsRepository';

export class SearchRecordsUseCase {
  constructor(private readonly recordsRepository: IRecordsRepository) {}

  async execute(query: string) {
    if (!query || query.trim() === '') {
      throw new AppError('keyword is required.', 400);
    }

    return this.recordsRepository.searchByKeyword(query);
  }
}
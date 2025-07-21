import { answerWithRAG } from '../../llm/query';

import { AppError } from '../../errors/AppError';

import { IRecordsRepository } from '../../repositories/IRecordsRepository';
import { IQueriesRepository } from '../../repositories/IQueriesRepository';

type AskQuestionRequest = {
  datasetId: string;
  question: string;
  userId: string;
}

export class AskQuestionUseCase {
  constructor(
    private readonly recordsRepository: IRecordsRepository,
    private readonly queriesRepository: IQueriesRepository
  ) {}

  async execute({ 
    datasetId, 
    question, 
    userId 
  }: AskQuestionRequest) {
    const records = await this.recordsRepository.findByDatasetId(datasetId); 

    if (!records || records.length == 0) {
      throw new AppError("Dataset not found", 404);
    }

    const rawData = records.map((r) => r.dataJson);
    const answer = await answerWithRAG(rawData, question);

    const stringifiedAnswer = JSON.stringify(answer);

    await this.queriesRepository.create({
      userId,
      question,
      answer: stringifiedAnswer
    });

    return answer;
  }
}
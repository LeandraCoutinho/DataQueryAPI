import { CreateQueryData, IQueriesRepository } from '../IQueriesRepository';
import { Query } from '@prisma/client';

export class InMemoryQueriesRepository implements IQueriesRepository {
  public queries: Query[] = [];

  async create(data: CreateQueryData): Promise<void> {
    const query: Query = {
      id: `query-${this.queries.length + 1}`,
      userId: data.userId,
      question: data.question,
      answer: data.answer,
      createdAt: new Date(),
    };

    this.queries.push(query);
  }

  async findAll(userId: string): Promise<Query[]> {
    return this.queries.filter((q) => q.userId === userId);
  }
}
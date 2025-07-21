import { Router } from 'express';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

import { PrismaRecordsRepository } from '../repositories/prisma/PrismaRecordsRepository';
import { AskQuestionUseCase } from '../useCases/queries/AskQuestionUseCase';
import { PrismaQueriesRepository } from '../repositories/prisma/PrismaQueriesRepository';
import { ListQueriesUseCase } from '../useCases/queries/ListQueriesUseCase';

const queriesRoutes = Router();

queriesRoutes.post(
    '/',
    ensureAuthenticated,
    async(req, res) => {
        const userId = req.user.id;
        const { datasetId, question } = req.body;

        const recordsRepository = new PrismaRecordsRepository();
        const queriesRepository = new PrismaQueriesRepository();
        const askQuestionUseCase = new AskQuestionUseCase(recordsRepository, queriesRepository);
        const answer = await askQuestionUseCase.execute({ datasetId, question, userId });

        return res.status(200).json(answer);
    }
);

queriesRoutes.get(
    '/',
    ensureAuthenticated,
    async(req, res) => {
        const userId = req.user.id;

        const queriesRepository = new PrismaQueriesRepository();
        const listQueriesUseCase = new ListQueriesUseCase(queriesRepository);

        const queries = await listQueriesUseCase.execute(userId);

        return res.status(200).json(queries);
    }
)

export { queriesRoutes };
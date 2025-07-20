import { Router } from 'express';
import { z } from 'zod';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

import { PrismaRecordsRepository } from '../repositories/prisma/PrismaRecordsRepository';
import { SearchRecordsUseCase } from '../useCases/records/SearchRecordsUseCase';

const recordsRoutes = Router();

recordsRoutes.get(
    '/search', 
    ensureAuthenticated, 
    async (req, res) => {
        const querySchema = z.object({
            query: z.string()
        });

        const { query } = querySchema.parse(req.query);
        
        const recordsRepository = new PrismaRecordsRepository();
        const searchRecordsUseCase = new SearchRecordsUseCase(recordsRepository);

        const records = await searchRecordsUseCase.execute(query);
        return res.status(200).json(records);
    }
);

export { recordsRoutes };
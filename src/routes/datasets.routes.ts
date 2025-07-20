import { Router } from 'express';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { upload } from '../config/upload';

import { UploadUseCase } from '../useCases/datasets/UploadUseCase';
import { PrismaDatasetsRepository } from '../repositories/prisma/PrismaDatasetsRepository';
import { PrismaRecordsRepository } from '../repositories/prisma/PrismaRecordsRepository';
import { ListDatasetsByUserUseCase } from '../useCases/datasets/ListDatasetsByUserUseCase';
import { ListRecordsByDatasetUseCse } from '../useCases/datasets/ListRecordsByDatasetUseCase';

const datasetsRoutes = Router();

datasetsRoutes.post(
    '/upload',
    ensureAuthenticated,
    upload.single('file'),
    async(req, res) => {
        const userId = req.user.id;
        const file = req.file;
        
        if (!file) {
            return res.status(400).json({ error: 'File not sent' });
        }

        const name = file.originalname;
        const size = file.size;
        const filePath = file.path;

        const datasetsRepository = new PrismaDatasetsRepository();
        const recordsRepository = new PrismaRecordsRepository();
        const uploadUseCase = new UploadUseCase(
            datasetsRepository,
            recordsRepository
        );

        await uploadUseCase.execute({
            name,
            userId,
            size,
            filePath
        });

        return res.status(201).send();
    }
);

datasetsRoutes.get(
    '/',
    ensureAuthenticated,
    async(req, res) => {
        const userId = req.user.id;
        
        const datasetsRepository = new PrismaDatasetsRepository();
        const listDatasetsByUserUseCase = new ListDatasetsByUserUseCase(datasetsRepository);
    
        const datasets = await listDatasetsByUserUseCase.execute(userId);
        
        return res.status(200).send(datasets);
    }
);

datasetsRoutes.get(
    '/:datasetId/records',
    ensureAuthenticated,
     async(req, res) => {
        const userId = req.user.id;
        const { datasetId } = req.params;
        
        const datasetsRepository = new PrismaDatasetsRepository();
        const listRecordsByDatasetUseCase = new ListRecordsByDatasetUseCse(datasetsRepository);

        const records = await listRecordsByDatasetUseCase.execute(userId, datasetId);

        return res.status(200).send(records);
    }
);

export { datasetsRoutes };
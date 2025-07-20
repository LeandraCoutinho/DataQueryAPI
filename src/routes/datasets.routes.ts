import { Router } from 'express';

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { upload } from '../config/upload';

import { UploadUseCase } from '../useCases/datasets/UploadUseCase';
import { PrismaDatasetsRepository } from '../repositories/prisma/PrismaDatasetsRepository';
import { PrismaRecordsRepository } from '../repositories/prisma/PrismaRecordsRepository';

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

export { datasetsRoutes };
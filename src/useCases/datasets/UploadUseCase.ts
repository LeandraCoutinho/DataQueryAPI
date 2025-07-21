import path from 'path';
import fs from 'fs/promises';
import csv from 'csvtojson';
import pdfParse from 'pdf-parse';

import { IDatasetsRepository } from '../../repositories/IDatasetsRepository';
import { IRecordsRepository } from '../../repositories/IRecordsRepository';

import { AppError } from '../../errors/AppError';

type UploadUseCaseRequest = {
    name: string;
    userId: string;
    size: number;
    filePath: string;
}

export class UploadUseCase {
    constructor(
      private readonly datasetsRepository: IDatasetsRepository,
      private readonly recordsRepository: IRecordsRepository
    ) {}

    async execute({
        name,
        userId,
        size,
        filePath
    }: UploadUseCaseRequest){
    
    const dataset = await this.datasetsRepository.create({
        name,
        userId,
        size
    });
   
    const ext = path.extname(name).toLowerCase();

    if (ext === ".csv") {
      const rows = await csv().fromFile(filePath);  
      await Promise.all(
        rows.map((row) =>
          this.recordsRepository.create({
            datasetId: dataset.id,
            content: [row],
          })
        )
      );
    } else if (ext === ".pdf") {
        const buffer = await fs.readFile(filePath);
        const data = await pdfParse(buffer);
        await this.recordsRepository.create({
          datasetId: dataset.id,
          content: [{ text: data.text }] as any[],
        });
    } else {
      throw new AppError("File format not supported", 400);
    }
  }   
}
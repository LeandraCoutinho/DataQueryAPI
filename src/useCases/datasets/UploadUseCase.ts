import path from 'path';
import fs from 'fs/promises';
import csv from 'csvtojson';
import pdfParse from 'pdf-parse';
import { IDatasetsRepository } from '../../repositories/IDatasetsRepository';
import { IRecordsRepository } from '../../repositories/IRecordsRepository';

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
    let jsonData: any[];

    if (ext === '.csv') {
      jsonData = await csv().fromFile(filePath);
    } else if (ext === '.pdf') {
      const buffer = await fs.readFile(filePath);
      const data = await pdfParse(buffer);
      jsonData = [{ text: data.text }];
    } else {
      throw new Error('Formato de arquivo não suportado para ingestão');
    }

    await this.recordsRepository.create({ datasetId: dataset.id, content: jsonData });
  }
}
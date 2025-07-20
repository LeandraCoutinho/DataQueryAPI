import path from 'path';
import fs from 'fs';
import express, { Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';

const tmpFolder = path.resolve(__dirname, '../', 'tmp');
const uploadsFolder = path.resolve(tmpFolder, 'uploads');

if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsFolder),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname.trim().replace(/\s+/g, '_');
    cb(null, `${timestamp}-${originalName}`);
  },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedMime = ['text/csv', 'application/pdf'];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Somente arquivos CSV ou PDF são permitidos'));  
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024, 
  },
  fileFilter,
});

export { upload, uploadsFolder };
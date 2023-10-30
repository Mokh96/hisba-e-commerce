import { BadRequestException } from '@nestjs/common';
import path, { extname, join } from 'path';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import { log } from 'console';
import { RequestOption } from './multer.middleware';
const destination = async (
  req: RequestOption,
  file: Express.Multer.File,
  cb: any,
) => {
  //if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);
  const uploadsFolderPath = req.dist;

  const filesCount = 100;
  let folderPath: string;
  console.log('uploadsFolderPath', uploadsFolderPath);

  try {
    if (!fs.existsSync(uploadsFolderPath))
      fs.mkdirSync(uploadsFolderPath, { recursive: true });

    const folders = await fs.promises.readdir(uploadsFolderPath);
    console.log('folders', folders);

    if (folders.length === 0) {
      folderPath = join(uploadsFolderPath, '0');
      await fs.promises.mkdir(folderPath);
    } else {
      const lastFolderPath = join(
        uploadsFolderPath,
        folders[folders.length - 1],
      );
      const files = await fs.promises.readdir(lastFolderPath);
      if (files.length < filesCount) {
        folderPath = lastFolderPath;
      } else {
        folderPath = join(uploadsFolderPath, folders.length.toString());
        await fs.promises.mkdir(folderPath);
      }
    }
    cb(null, folderPath);
  } catch (err) {
    cb(err);
  }
};

const filename = (req: RequestOption, file: Express.Multer.File, cb: any) =>
  cb(null, `${Date.now()}-hisba-erp-${file.originalname}`);

export const multerStorage = diskStorage({
  destination,
  filename,
});

export const multerFileFilter = (req, file, cb) => {
  //   configMulter(type);
  const ext = extname(file.originalname).toLowerCase();
  //   const message = `Only ${TYPES[req.type]} format are allowed .`;
  //   const code = `Upload${TYPES[req.type]}`;

  if (!req.filterArray.includes(ext)) {
    cb(
      new BadRequestException(
        'File type not supported. Only JPEG and PNG allowed.',
      ),
      false,
    );
  }
  cb(null, true);
};

export const multerLimits = {
  fileSize: 2 * 1024 * 1024, // 2 MB limit
};

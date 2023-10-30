// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const IntendedEx = require('../helpers/IntendedEx');
import fs from 'fs';
import multer from 'multer';
import path from 'path';
const destination = async (req, file, cb) => {
  //if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);
  const uploadsFolderPath = req.dist;

  const filesCount = 100;
  let folderPath;

  try {
    if (!fs.existsSync(uploadsFolderPath))
      fs.mkdirSync(uploadsFolderPath, { recursive: true });
    const folders = await fs.promises.readdir(uploadsFolderPath);
    if (folders.length === 0) {
      folderPath = path.join(uploadsFolderPath, '0');
      await fs.promises.mkdir(folderPath);
    } else {
      const lastFolderPath = path.join(
        uploadsFolderPath,
        folders[folders.length - 1],
      );
      const files = await fs.promises.readdir(lastFolderPath);
      if (files.length < filesCount) {
        folderPath = lastFolderPath;
      } else {
        folderPath = path.join(uploadsFolderPath, folders.length.toString());
        await fs.promises.mkdir(folderPath);
      }
    }
    cb(null, folderPath);
  } catch (err) {
    cb(err);
  }
};

const filename = (req, file, cb) =>
  cb(null, `${Date.now()}-hisba-erp-${file.originalname}`);

const storage = multer.diskStorage({ destination, filename });

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const message = `Only ${TYPES[req.type]} format are allowed .`;
  const code = `Upload${TYPES[req.type]}`;

  if (!req.filterArray.includes(ext))
    return cb(new Error('File type not supported. Only JPEG and PNG allowed.'));
  else cb(null, true);
};

module.exports = (type, maxCount = 1) => {
  return (req, res, next) => {
    req.type = type;
    const basePath = path.join(process.cwd(), 'uploads');
    switch (type) {
      case 1:
        req.filterArray = [
          '.png',
          '.jpg',
          '.gif',
          '.jpeg',
          '.tif',
          '.tiff',
          '.svg',
          '.BMP',
        ];
        req.dist = path.join(basePath, 'images');
        break;

      case 2:
        req.filterArray = ['.pdf'];
        req.dist = path.join(basePath, 'pdf');
        break;

      case 3:
        req.filterArray = ['.apk', '.zip', '.rar'];
        req.dist = path.join(basePath, 'updates');
        break;

      case 10:
        req.filterArray = [
          '.png',
          '.jpg',
          '.gif',
          '.jpeg',
          '.apk',
          '.zip',
          '.rar',
          '.pdf',
        ];
        req.dist = path.join(basePath, 'test');
        return multer({ storage, fileFilter }).array('test')(req, res, next);
    }
    return multer({ storage, fileFilter }).fields([
      { name: TYPES[type], maxCount },
    ])(req, res, next);
  };
};

const TYPES = {
  1: 'img',
  2: 'pdf',
  3: 'file',
  10: 'test',
};

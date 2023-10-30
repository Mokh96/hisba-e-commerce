import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
export interface RequestOption extends Request {
  filterArray: string[];
  dist: string;
}

export const multerConfigMiddleware = (options: {
  type: string;
  maxCount: number;
}) => {
  return (req: RequestOption, res: Response, next: NextFunction) => {
    const { type, maxCount } = options;
    console.log(type, maxCount);

    const basePath = path.join(process.cwd(), 'uploads');

    switch (type) {
      case '1':
        // req.type = 1;
        req.filterArray = [
          '.png',
          '.jpg',
          '.gif',
          '.jpeg',
          '.tif',
          '.tiff',
          '.svg',
          '.BMP',
          '.webp',
        ];
        req.dist = path.join(basePath, 'images');
        break;

      case '2':
        req.filterArray = ['.pdf'];
        req.dist = path.join(basePath, 'pdf');
        break;

      case '3':
        req.filterArray = ['.apk', '.zip', '.rar'];
        req.dist = path.join(basePath, 'updates');
        break;

      case '10':
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
        break;

      default:
        // Handle any other cases or set defaults as needed
        req.filterArray = [];
        req.dist = path.join(basePath, 'default');
        break;
    }

    next();
  };
};
// @Injectable()
// export class MulterConfigMiddleware implements NestMiddleware {
//   constructor(private readonly options: { type: string; maxCount: number }) {}

//   use(req: RequestOption, res: Response, next: NextFunction) {
//     const { type, maxCount } = this.options;
//     const basePath = path.join(process.cwd(), 'uploads');

//     switch (type) {
//       case '1':
//         // req.type = 1;
//         req.filterArray = [
//           '.png',
//           '.jpg',
//           '.gif',
//           '.jpeg',
//           '.tif',
//           '.tiff',
//           '.svg',
//           '.BMP',
//           '.webp',
//         ];
//         req.dist = path.join(basePath, 'images');
//         break;

//       case '2':
//         req.filterArray = ['.pdf'];
//         req.dist = path.join(basePath, 'pdf');
//         break;

//       case '3':
//         req.filterArray = ['.apk', '.zip', '.rar'];
//         req.dist = path.join(basePath, 'updates');
//         break;

//       case '10':
//         req.filterArray = [
//           '.png',
//           '.jpg',
//           '.gif',
//           '.jpeg',
//           '.apk',
//           '.zip',
//           '.rar',
//           '.pdf',
//         ];
//         req.dist = path.join(basePath, 'test');
//         break;

//       default:
//         // Handle any other cases or set defaults as needed
//         req.filterArray = [];
//         req.dist = path.join(basePath, 'default');
//         break;
//     }

//     next();
//   }
// }

// export const createMulterConfigMiddleware = (options: {
//   type: string;
//   maxCount: number;
// }) => {
//   return new MulterConfigMiddleware(options);
// };

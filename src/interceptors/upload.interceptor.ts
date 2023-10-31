import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as path from 'path';

export interface RequestOption {
  filterArray: string[];
  dist: string;
}

@Injectable()
export class UploadInterceptor implements NestInterceptor {
  constructor(private readonly options: { type: string }) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<RequestOption>();
    const { type } = this.options;

    const basePath = path.join(process.cwd(), 'uploads');

    switch (type) {
      case '1':
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
        req.filterArray = [];
        req.dist = path.join(basePath, 'default');
        break;
    }

    return next.handle();
  }
}

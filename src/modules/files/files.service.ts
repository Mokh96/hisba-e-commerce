import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { UPLOAD_ROOT_DIR } from 'src/modules/files/constant/upload.constant';

@Injectable()
export class FilesService {
  getFile(path: string, res: Response) {
    const normalizedPath = path.replace(/,/g, '/');
    const filePath = join(UPLOAD_ROOT_DIR, normalizedPath);

    if (!existsSync(filePath)) {
      throw new NotFoundException('File not found');//todo use i 18n
    }

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }
}


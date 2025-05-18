import { Injectable, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import { UPLOAD_ROOT_DIR } from 'src/modules/files/constant/upload.constant';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'src/startup/i18n/generated/i18n.generated';

@Injectable()
export class FilesService {
  constructor(private readonly i18n: I18nService<I18nTranslations>) {}

  getFile(path: string, res: Response) {
    const normalizedPath = path.replace(/,/g, '/');
    const filePath = join(UPLOAD_ROOT_DIR, normalizedPath);

    if (!existsSync(filePath)) {
      throw new NotFoundException(this.i18n.translate('errors.fileNotFound'));
    }

    const fileStream = createReadStream(filePath);
    fileStream.pipe(res);
  }
}

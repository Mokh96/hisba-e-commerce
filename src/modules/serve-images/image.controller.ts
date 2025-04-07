// image.controller.ts
import { Controller, Get, Param, Res, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { Public } from 'src/common/decorators/public.decorator';
import { ImageParamsDto } from './dtos/image-params.dto';

@Controller() // No prefix here
export class ImageController {
  @Public()
  @Get('/:type/:file/:name')
  async serveImage(
    @Param(ValidationPipe) imageParams: ImageParamsDto,
    @Res() res: Response,
  ) {
    const { type, file, name } = imageParams;

    const filePath = path.join(process.cwd(), `uploads`, type, file, name);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.json({ error: 'File not found', status: 404 });
    }
  }
}

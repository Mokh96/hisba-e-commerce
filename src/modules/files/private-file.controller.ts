import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';

@Controller('private-files')
export class PrivateFileController {
  constructor(private readonly fileService: FilesService) {}

  @Get(':path(*)')//@Get('*path')
  async getFile(@Param('path') path: string, @Res() res: Response) {
    this.fileService.getFile(path, res);
  }
}

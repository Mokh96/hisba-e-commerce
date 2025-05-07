import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { Public } from 'src/common/decorators';

@Public()
@Controller('files')
export class PublicFilesController {
  constructor(private readonly fileService: FilesService) {}

  @Get(':path(*)')
  async getFile(@Param('path') path: string, @Res() res: Response) {
    this.fileService.getFile(path, res);
  }
}

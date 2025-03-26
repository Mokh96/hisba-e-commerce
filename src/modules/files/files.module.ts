import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { PublicFilesController } from 'src/modules/files/public-files.controller';
import { PrivateFileController } from 'src/modules/files/private-file.controller';

@Module({
  controllers: [PublicFilesController, PrivateFileController],
  providers: [FilesService],
})
export class FilesModule {}

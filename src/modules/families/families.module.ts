import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Family } from './entities/family.entity';
import { SyncFamilyController } from './families-sync.controller';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { FileTypesEnum } from 'src/modules/files/enums/file-types.enum';

@Module({
  imports: [TypeOrmModule.forFeature([Family])],
  controllers: [SyncFamilyController, FamiliesController],
  providers: [
    FamiliesService,
    {
      provide: UploadManager,
      useFactory: () => new UploadManager(FileTypesEnum.Public, []),
    },
  ],
})
export class FamiliesModule {}

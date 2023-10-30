import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import {
  //   MulterConfigMiddleware,
  //   createMulterConfigMiddleware,
  multerConfigMiddleware,
} from './multer.middleware';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  //   imports:[]
})
// export class UploadModule {}
export class UploadModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const options = { type: '1', maxCount: 1 }; // Provide your custom options here
    const middleware = multerConfigMiddleware(options);

    consumer.apply(middleware).forRoutes('upload');
  }
}

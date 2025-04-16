import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';

import { BulkResponse } from 'src/common/types/bulk-response.type';
import { checkChildrenRecursive } from 'src/helpers/function.global';
import { pathToFile, removeFileIfExist } from 'src/helpers/paths';
import { Image } from 'src/types/types.global';
import { CreateBrandDto, CreateSyncBrandDto } from './dto/create-brand.dto';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UploadManager } from 'src/modules/files/upload/upload-manager';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    private readonly uploadManager: UploadManager,
  ) {}

  async create(
    createBrandDto: CreateBrandDto,
    files: {
      [FileUploadEnum.Image]: Express.Multer.File[];
    },
  ) {
    const uploadedImage = await this.uploadManager.uploadFiles(files);

    try {
      return await this.brandRepository.save({
        ...createBrandDto,
        imgPath: uploadedImage[0].path || null,
      });
    } catch (e) {
      await this.uploadManager.cleanupFiles(uploadedImage);
      throw e;
    }
  }

  async createSyncBulk(createBrandDto: CreateSyncBrandDto[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (const brand of createBrandDto) {
      try {
        const newBrand = this.brandRepository.create(brand);
        await this.brandRepository.save(newBrand);
        response.successes.push({
          id: newBrand.id,
          syncId: newBrand.syncId,
        });
      } catch (err) {
        response.failures.push({
          syncId: brand.syncId,
          errors: [err.sqlMessage],
        });
      }
    }

    return response;
  }

  async findAll() {
    return await this.brandRepository.find();
  }

  async findOne(id: number) {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException('brand not found');
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, file: Image) {
    if (updateBrandDto.parentId) {
      if (updateBrandDto.parentId === id) throw new BadRequestException('parent Id must be not children of this brand');
      // TODO: edit message of this error
      if (!checkChildrenRecursive(id, await this.findAll(), updateBrandDto.parentId))
        throw new BadRequestException('parent Id must be not children of this brand');
    }

    const { isDelete } = updateBrandDto;
    const brand = await this.findOne(id);
    const oldPath = brand.imgPath;
    const imgPath = isDelete ? null : file?.img ? pathToFile(file.img[0]) : oldPath;

    const updatedBrand = this.brandRepository.merge(brand, updateBrandDto, {
      imgPath,
    });

    await this.brandRepository.save(updatedBrand);
    if (isDelete || file?.img) removeFileIfExist(oldPath);

    return updatedBrand;
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    await this.brandRepository.remove(brand);
    if (brand.imgPath) removeFileIfExist(brand.imgPath);
    return true;
  }
}

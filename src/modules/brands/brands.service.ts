import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBrandDto, UpdateSyncBrandsDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';
import { BulkResponse } from 'src/common/types/bulk-response.type';
import { checkChildrenRecursive, fromDtoToQuery } from 'src/helpers/function.global';
import { CreateBrandDto, CreateSyncBrandDto } from './dto/create-brand.dto';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { getFilesBySyncId } from 'src/modules/files/utils/file-lookup.util';
import { BrandFilterDto } from 'src/modules/brands/dto/brand-filter.dto';

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

  async createSyncBulk(createBrandDto: CreateSyncBrandDto[], files: Express.Multer.File[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (const brand of createBrandDto) {
      const brandImage = getFilesBySyncId(files, FileUploadEnum.Image, brand.syncId);

      try {
        const createdBrand = await this.create(brand, { [FileUploadEnum.Image]: brandImage });
        response.successes.push(createdBrand);
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

  async findMany(filterDto: BrandFilterDto, paginationDto: BasePaginationDto) {
    const filter = fromDtoToQuery(filterDto);

    const [row, count] = await this.brandRepository.findAndCount({
      where: filter,
      skip: paginationDto.offset,
      take: paginationDto.limit,
    });

    return {
      count,
      row,
    };
  }

  async findOne(id: number) {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException('brand not found');
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, files: { [FileUploadEnum.Image]: Express.Multer.File[] }) {
    // Validate parent-child relationship
    if (updateBrandDto.parentId) {
      if (updateBrandDto.parentId === id) {
        throw new BadRequestException('parent Id must be not children of this brand');
      }
      if (!checkChildrenRecursive(id, await this.findAll(), updateBrandDto.parentId)) {
        throw new BadRequestException('parent Id must be not children of this brand');
      }
    }

    const brand = await this.brandRepository.findOneByOrFail({ id });

    const initialImgPath = brand.imgPath;
    let uploadedFiles = [];
    let newPath: string | undefined;

    try {
      // Upload new files if provided
      uploadedFiles = await this.uploadManager.uploadFiles(files);
      newPath = uploadedFiles.length > 0 ? uploadedFiles[0].path : undefined;

      // Merge updates
      const updatedBrand = this.brandRepository.merge(brand, updateBrandDto, {
        imgPath: newPath ?? (updateBrandDto.removeImage ? null : initialImgPath),
      });

      // Save the updated brand
      const savedBrand = await this.brandRepository.save(updatedBrand);

      // Remove old image if necessary
      if ((newPath && initialImgPath) || updateBrandDto.removeImage) {
        await this.uploadManager.removeFile(initialImgPath);
      }

      return savedBrand;
    } catch (error) {
      await this.uploadManager.cleanupFiles(uploadedFiles);
      throw error;
    }
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    await this.brandRepository.remove(brand);
    //if (brand.imgPath) removeFileIfExist(brand.imgPath);
    return true;
  }

  async updateBulk(updateBrandDto: UpdateSyncBrandsDto[], files: Express.Multer.File[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (const updateBrand of updateBrandDto) {
      const brandImage = getFilesBySyncId(files, FileUploadEnum.Image, updateBrand.syncId);
      try {
        const brand = await this.update(updateBrand.id, updateBrand, {
          [FileUploadEnum.Image]: brandImage,
        });
        response.successes.push(brand);
      } catch (error) {
        response.failures.push({
          syncId: updateBrand.syncId,
          errors: error,
        });
      }
    }
    return response;
  }
}

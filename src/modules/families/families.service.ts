import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';
import { BulkResponse } from 'src/common/types/bulk-response.type';
import { checkChildrenRecursive, fromDtoToQuery } from 'src/helpers/function.global';
import {  removeFileIfExist } from 'src/helpers/paths';
import { Repository } from 'typeorm';
import { CreateFamilyDto, CreateSyncFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto, UpdateSyncFamiliesDto } from './dto/update-family.dto';
import { Family } from './entities/family.entity';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { getFilesBySyncId } from 'src/modules/files/utils/file-lookup.util';
import { UpdateSyncBrandsDto } from 'src/modules/brands/dto/update-brand.dto';
import { FamilyFilterDto } from 'src/modules/families/dto/family-filter.dto';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,
    private readonly uploadManager: UploadManager,
  ) {}

  async create(createFamilyDto: CreateFamilyDto, files: { [FileUploadEnum.Image]: Express.Multer.File[] }) {
    const uploadedImage = await this.uploadManager.uploadFiles(files);
    try {
      return await this.familyRepository.save({
        ...createFamilyDto,
        imgPath: uploadedImage[0].path || null,
      });
    } catch (e) {
      await this.uploadManager.cleanupFiles(uploadedImage);
      throw e;
    }
  }

  async createSyncBulk(createFamilyDto: CreateSyncFamilyDto[], files: Express.Multer.File[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (const family of createFamilyDto) {
      const familyImage = getFilesBySyncId(files, FileUploadEnum.Image, family.syncId);

      try {
        const createdBrand = await this.create(family, { [FileUploadEnum.Image]: familyImage });
        response.successes.push(createdBrand);
      } catch (err) {
        response.failures.push({
          syncId: family.syncId,
          errors: [err.sqlMessage],
        });
      }
    }

    return response;
  }

  async findAll() {
    const families = await this.familyRepository.find();
    return families;
  }

  async findMany(filterDto: FamilyFilterDto, paginationDto: BasePaginationDto) {
    const filter = fromDtoToQuery(filterDto);

    const [row, count] = await this.familyRepository.findAndCount({
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
    const family = await this.familyRepository.findOneBy({ id });
    if (!family) throw new NotFoundException('family not found');
    return family;
  }

  async update(id: number, updateFamilyDto: UpdateFamilyDto, files: { [FileUploadEnum.Image]: Express.Multer.File[] }) {
    if (updateFamilyDto.parentId) {
      if (updateFamilyDto.parentId === id)
        throw new BadRequestException('parent Id must be not children of this family');
      if (checkChildrenRecursive(id, await this.findAll(), updateFamilyDto.parentId) === false)
        throw new BadRequestException('parent Id must be not children of this family');
    }

    const family = await this.familyRepository.findOneByOrFail({ id });

    const initialImgPath = family.imgPath;
    let uploadedFiles = [];
    let newPath: string | undefined;

    try {
      // Upload new files if provided
      uploadedFiles = await this.uploadManager.uploadFiles(files);
      newPath = uploadedFiles.length > 0 ? uploadedFiles[0].path : undefined;

      // Merge updates
      const updatedFamily = this.familyRepository.merge(family, updateFamilyDto, {
        imgPath: newPath ?? (updateFamilyDto.removeImage ? null : initialImgPath),
      });

      // Save the updated family
      const savedFamily = await this.familyRepository.save(updatedFamily);

      // Remove old image if necessary
      if ((newPath && initialImgPath) || updateFamilyDto.removeImage) {
        await this.uploadManager.removeFile(initialImgPath);
      }

      return savedFamily;
    } catch (error) {
      await this.uploadManager.cleanupFiles(uploadedFiles);
      throw error;
    }
  }

  async updateBulk(updateSyncFamiliesDto: UpdateSyncFamiliesDto[], files: Express.Multer.File[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (const updateFamily of updateSyncFamiliesDto) {
      const familyImage = getFilesBySyncId(files, FileUploadEnum.Image, updateFamily.syncId);
      try {
        const family = await this.update(updateFamily.id, updateFamily, {
          [FileUploadEnum.Image]: familyImage,
        });
        response.successes.push(family);
      } catch (error) {
        response.failures.push({
          syncId: updateFamily.syncId,
          errors: error,
        });
      }
    }
    return response;
  }

  async remove(id: number) {
    const family = await this.findOne(id);
    await this.familyRepository.remove(family);
    if (family.imgPath) removeFileIfExist(family.imgPath);

    return true;
  }
}

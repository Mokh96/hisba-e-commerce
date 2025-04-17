import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BulkResponse } from 'src/common/types/bulk-response.type';
import { checkChildrenRecursive } from 'src/helpers/function.global';
import { pathToFile, removeFileIfExist } from 'src/helpers/paths';
import { validateBulkInsert } from 'src/helpers/validation/global';
import { Image } from 'src/types/types.global';
import { Repository } from 'typeorm';
import { CreateFamilyDto, CreateSyncFamilyDto } from './dto/create-family.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family } from './entities/family.entity';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { getFilesBySyncId } from 'src/modules/files/utils/file-lookup.util';

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

  async findOne(id: number) {
    const family = await this.familyRepository.findOneBy({ id });
    if (!family) throw new NotFoundException('family not found');
    return family;
  }

  async update(id: number, updateFamilyDto: UpdateFamilyDto, file: Image) {
    if (updateFamilyDto.parentId) {
      if (updateFamilyDto.parentId === id)
        throw new BadRequestException('parent Id must be not children of this brand');
      // TODO: edit message of this error
      if (checkChildrenRecursive(id, await this.findAll(), updateFamilyDto.parentId) === false)
        throw new BadRequestException('parent Id must be not children of this brand');
    }
    const { isDelete } = updateFamilyDto;

    const family = await this.findOne(id);
    const oldPath = family.imgPath;
    const imgPath = isDelete ? null : file?.img ? pathToFile(file.img[0]) : oldPath;
    const updatedFamily = this.familyRepository.merge(family, updateFamilyDto, {
      imgPath,
    });
    await this.familyRepository.save(updatedFamily);
    if (isDelete || file?.img) removeFileIfExist(oldPath);

    return updatedFamily;
  }

  async remove(id: number) {
    const family = await this.findOne(id);
    await this.familyRepository.remove(family);
    if (family.imgPath) removeFileIfExist(family.imgPath);

    return true;
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';
import { BulkResponse } from 'src/common/types/bulk-response.type';
import { checkChildrenRecursive, fromDtoToQuery } from 'src/helpers/function.global';
import { pathToFile, removeFileIfExist } from 'src/helpers/paths';
import { validateBulkInsert } from 'src/helpers/validation/global';
import { Image } from 'src/types/types.global';
import { Repository } from 'typeorm';
import { CreateSyncFamilyDto } from './dto/create-family.dto';
import { FamilyFilterDto } from './dto/family-filter.dto';
import { UpdateFamilyDto } from './dto/update-family.dto';
import { Family } from './entities/family.entity';

@Injectable()
export class FamiliesService {
  constructor(
    @InjectRepository(Family)
    private familyRepository: Repository<Family>,
  ) {}

  async create(createFamilyDto: CreateSyncFamilyDto, file: Image) {
    const family = this.familyRepository.create(createFamilyDto);
    const newFamily = this.familyRepository.merge(family, {
      imgPath: file.img ? pathToFile(file.img[0]) : null,
    });
    await this.familyRepository.save(newFamily);
    return newFamily;
  }

  async createBulk(createFamilyDto: CreateSyncFamilyDto[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (const family of createFamilyDto) {
      try {
        const newFamily = this.familyRepository.create(family);
        await this.familyRepository.save(newFamily);
        response.successes.push({
          id: newFamily.id,
          syncId: newFamily.syncId,
        });
      } catch (err) {
        response.failures.push({
          syncId: family.syncId,
          errors: [err.sqlMessage],
        });
      }
    }

    return response;
  }

  async createSyncBulk(createFamilyDto: CreateSyncFamilyDto[]) {
    const { validatedData, failureData } = await validateBulkInsert<CreateSyncFamilyDto[]>(createFamilyDto, 'family');

    const successData: CreateSyncFamilyDto[] = [];

    if (failureData.length === createFamilyDto.length)
      // TODO: change validation failure message
      throw new BadRequestException(' your body not valid ');

    for (let i = 0; i < validatedData.length; i++) {
      try {
        const family = this.familyRepository.create(validatedData[i]);
        await this.familyRepository.save(family);

        successData.push(family);
      } catch (error) {
        failureData.push({
          index: createFamilyDto.findIndex((item) => item.syncId === validatedData[i].syncId),
          message: 'insert error',
        });
      }
    }
    return { successData, failureData };
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

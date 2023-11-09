import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';

import { pathToFile, removeFileIfExist } from 'src/helpers/paths';
import { Image } from 'src/types/types.global';
import { checkChildrenRecursive } from 'src/helpers/function.global';
import { validateBulkInsert } from 'src/helpers/validation/global';
import { CreateSyncBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}
  async create(createBrandDto: CreateSyncBrandDto, file: Image) {
    const brand = this.brandRepository.create(createBrandDto);
    const newBrand = this.brandRepository.merge(brand, {
      imgPath: file.img ? pathToFile(file.img[0]) : null,
    });
    await this.brandRepository.save(newBrand);
    return newBrand;
  }

  async createSyncBulk(createBrandDto: CreateSyncBrandDto[]) {
    const { validatedData, failureData } = await validateBulkInsert<
      CreateSyncBrandDto[]
    >(createBrandDto, 'brand');

    const successData: CreateSyncBrandDto[] = [];

    if (failureData.length === createBrandDto.length)
      // TODO: change validation failure message
      throw new BadRequestException(' your body not valide ');

    for (let i = 0; i < validatedData.length; i++) {
      try {
        const brand = this.brandRepository.create(validatedData[i]);
        await this.brandRepository.save(brand);

        successData.push(brand);
      } catch (error) {
        failureData.push({
          index: createBrandDto.findIndex(
            (item) => item.syncId === validatedData[i].syncId,
          ),
          message: 'insert error',
        });
      }
    }
    return { successData, failureData };
  }

  async findAll() {
    const brands = await this.brandRepository.find();
    return brands;
  }

  async findOne(id: number) {
    const brand = await this.brandRepository.findOneBy({ id });
    if (!brand) throw new NotFoundException('brand not found');
    return brand;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, file: Image) {
    if (updateBrandDto.parentId) {
      if (updateBrandDto.parentId === id)
        throw new BadRequestException(
          'parent Id must be not children of this brand',
        );
      // TODO: edit message of this error
      if (
        !checkChildrenRecursive(
          id,
          await this.findAll(),
          updateBrandDto.parentId,
        )
      )
        throw new BadRequestException(
          'parent Id must be not children of this brand',
        );
    }

    const { isDelete } = updateBrandDto;
    const brand = await this.findOne(id);
    const oldPath = brand.imgPath;
    const imgPath = isDelete
      ? null
      : file?.img
      ? pathToFile(file.img[0])
      : oldPath;

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

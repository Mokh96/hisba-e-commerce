import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';

import { pathToFile, removeFileIfExist } from 'src/helpers/paths';
import { Image } from 'src/types/types.global';
import { checkChildrenRecursive } from 'src/helpers/function.globa';
import { CreatSyncBrandDto } from './dto/createSync-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}
  async createSync(createSyncBrandDto: CreatSyncBrandDto) {
    const brand = this.brandRepository.create(createSyncBrandDto);

    await this.brandRepository.save(brand);
    return brand;
  }
  async create(createBrandDto: CreatSyncBrandDto, file: Image) {
    const brand = this.brandRepository.create(createBrandDto);

    const newBrand = this.brandRepository.merge(brand, {
      imgPath: file.img ? pathToFile(file.img[0]) : null,
      syncId: createBrandDto.syncId,
    });
    await this.brandRepository.save(newBrand);

    return newBrand;
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
    return true;
  }
}

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
    const brand = this.brandRepository.create({
      label: createSyncBrandDto.label,
      syncId: createSyncBrandDto.syncId,
      parentId: createSyncBrandDto.parentId,
    });

    await this.brandRepository.save(brand);

    return brand;
  }
  async create(createBrandDto: CreateBrandDto, file: Image) {
    const brand = this.brandRepository.create(createBrandDto);

    const newBrand = this.brandRepository.merge(brand, {
      imgPath: file.img ? pathToFile(file.img[0]) : null,
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
        checkChildrenRecursive(
          id,
          await this.findAll(),
          updateBrandDto.parentId,
        ) === false
      )
        throw new BadRequestException(
          'parent Id must be not children of this brand',
        );
    }
    const brand = await this.findOne(id);
    const oldPath = file.img ? brand.imgPath : null;
    const updatedBrand = this.brandRepository.merge(brand, updateBrandDto, {
      imgPath: file.img ? pathToFile(file.img[0]) : brand.imgPath,
    });
    await this.brandRepository.save(updatedBrand);
    if (file.img) removeFileIfExist(oldPath);

    return updatedBrand;
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    await this.brandRepository.remove(brand);
    return true;
  }
}

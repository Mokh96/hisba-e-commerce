import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';

import { pathToFile, removeFileIfExist } from 'src/helpers/paths';
import { Image } from 'src/types/types.global';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

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

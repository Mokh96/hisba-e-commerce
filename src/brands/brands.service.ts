import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { Image, ImageFile } from './type';
import { pathToFile } from 'src/helpers/paths';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto, file: Express.Multer.File[]) {
    console.log('file service', file);

    const brand = this.brandRepository.create(createBrandDto);
    // const newBrand = this.brandRepository.merge(brand, {
    //   imgPath: file ? pathToFile(file[0].img[0]) : null,
    // });
    console.log('newBrand', brand);
    await this.brandRepository.save(brand);

    return brand;
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

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    const brand = await this.findOne(id);
    const updatedBrand = this.brandRepository.merge(brand, updateBrandDto);
    await this.brandRepository.save(updatedBrand);
    return updatedBrand;
  }

  async remove(id: number) {
    const brand = await this.findOne(id);
    await this.brandRepository.remove(brand);
    return true;
  }
}

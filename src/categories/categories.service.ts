import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Image } from 'src/types/types.global';
import { pathToFile, removeFileIfExist } from 'src/helpers/paths';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, file: Image) {
    const category = this.categoryRepository.create(createCategoryDto);
    const newCategoty = this.categoryRepository.merge(category, {
      imgPath: file.img ? pathToFile(file.img[0]) : null,
    });
    await this.categoryRepository.save(newCategoty);
    return newCategoty;
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, file: Image) {
    const category = await this.findOne(id);
    const oldPath = file.img ? category.imgPath : null;

    const updatedCategory = this.categoryRepository.merge(
      category,
      updateCategoryDto,
      {
        imgPath: file.img ? pathToFile(file.img[0]) : category.imgPath,
      },
    );
    await this.categoryRepository.save(updatedCategory);
    if (file.img) removeFileIfExist(oldPath);

    return updatedCategory;
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return true;
  }
}

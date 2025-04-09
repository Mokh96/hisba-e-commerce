import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BulkResponse } from 'src/common/types/bulk-response.type';
import { checkChildrenRecursive } from 'src/helpers/function.global';
import { pathToFile, removeFileIfExist } from 'src/helpers/paths';
import { validateBulkInsert } from 'src/helpers/validation/global';
import { Image } from 'src/types/types.global';
import { Repository } from 'typeorm';
import { CreateCategoryDto, CreateSyncCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateSyncCategoryDto | CreateCategoryDto, file: Image) {
    const category = this.categoryRepository.create(createCategoryDto);
    const newCategory = this.categoryRepository.merge(category, {
      imgPath: file.img ? pathToFile(file.img[0]) : null,
    });
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  async createBulk(createCategoryDto: CreateSyncCategoryDto[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (const category of createCategoryDto) {
      try {
        const newCategory = this.categoryRepository.create(category);
        await this.categoryRepository.save(newCategory);
        response.successes.push({
          id: newCategory.id,
          syncId: newCategory.syncId,
        });
      } catch (err) {
        response.failures.push({
          syncId: category.syncId,
          errors: [err.sqlMessage],
        });
      }
    }

    return response;
  }

  async createSyncBulk(createCategoryDto: CreateSyncCategoryDto[]) {
    const { validatedData, failureData } = await validateBulkInsert<CreateSyncCategoryDto[]>(
      createCategoryDto,
      'category',
    );

    const successData: CreateSyncCategoryDto[] = [];

    if (failureData.length === createCategoryDto.length)
      // TODO: change validation failure message
      throw new BadRequestException(' your body not valid ');

    for (let i = 0; i < validatedData.length; i++) {
      try {
        const category: CreateSyncCategoryDto = this.categoryRepository.create(validatedData[i]);
        await this.categoryRepository.save(category);

        successData.push(category);
      } catch (error) {
        failureData.push({
          index: createCategoryDto.findIndex((item) => item.syncId === validatedData[i].syncId),
          message: 'insert error',
        });
      }
    }
    return { successData, failureData };
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
    if (updateCategoryDto.parentId) {
      if (updateCategoryDto.parentId === id)
        throw new BadRequestException('parent Id must be not children of this brand');
      // TODO: edit message of this error
      if (!checkChildrenRecursive(id, await this.findAll(), updateCategoryDto.parentId))
        throw new BadRequestException('parent Id must be not children of this brand');
    }
    const { isDelete } = updateCategoryDto;

    const category = await this.findOne(id);
    const oldPath = category.imgPath;
    const imgPath = isDelete ? null : file?.img ? pathToFile(file.img[0]) : oldPath;
    const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto, {
      imgPath,
    });
    await this.categoryRepository.save(updatedCategory);
    if (isDelete || file?.img) removeFileIfExist(oldPath);

    return updatedCategory;
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    if (category.imgPath) removeFileIfExist(category.imgPath);

    return true;
  }
}

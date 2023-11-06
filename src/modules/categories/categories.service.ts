import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Image } from 'src/types/types.global';
import { pathToFile, removeFileIfExist } from 'src/helpers/paths';
import { checkChildrenRecursive } from 'src/helpers/function.globa';
import { CreateSyncCategoryDto } from './dto/createSync-brand.dto';
import { validateBulkInsert } from 'src/helpers/validation/global';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateSyncCategoryDto, file: Image) {
    const category = this.categoryRepository.create(createCategoryDto);
    const newCategory = this.categoryRepository.merge(category, {
      imgPath: file.img ? pathToFile(file.img[0]) : null,
    });
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  async createSyncBulk(createCategoryDto: CreateSyncCategoryDto[]) {
    const { validatedData, failureData } = await validateBulkInsert<
      CreateSyncCategoryDto[]
    >(createCategoryDto, 'category');

    const successData: CreateSyncCategoryDto[] = [];

    if (failureData.length === createCategoryDto.length)
      // TODO: change validation failure message
      throw new BadRequestException(' your body not valide ');

    for (let i = 0; i < validatedData.length; i++) {
      try {
        const category = this.categoryRepository.create(validatedData[i]);
        await this.categoryRepository.save(category);

        successData.push(category);
      } catch (error) {
        failureData.push({
          index: createCategoryDto.findIndex(
            (item) => item.syncId === validatedData[i].syncId,
          ),
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
        throw new BadRequestException(
          'parent Id must be not children of this brand',
        );
      // TODO: edit message of this error
      if (
        !checkChildrenRecursive(
          id,
          await this.findAll(),
          updateCategoryDto.parentId,
        )
      )
        throw new BadRequestException(
          'parent Id must be not children of this brand',
        );
    }
    const { isDelete } = updateCategoryDto;

    const category = await this.findOne(id);
    const oldPath = category.imgPath;
    const imgPath = isDelete
      ? null
      : file?.img
      ? pathToFile(file.img[0])
      : oldPath;
    const updatedCategory = this.categoryRepository.merge(
      category,
      updateCategoryDto,
      {
        imgPath,
      },
    );
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

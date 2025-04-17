import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BulkResponse } from 'src/common/types/bulk-response.type';
import { checkChildrenRecursive, fromDtoToQuery } from 'src/helpers/function.global';
import { pathToFile, removeFileIfExist } from 'src/helpers/paths';
import { validateBulkInsert } from 'src/helpers/validation/global';
import { Image } from 'src/types/types.global';
import { Repository } from 'typeorm';
import { BasePaginationDto } from 'src/common/dtos/base-pagination.dto';
import { CategoryFilterDto } from './dto/category-filter.dto';
import { CreateCategoryDto, CreateSyncCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { getFilesBySyncId } from 'src/modules/files/utils/file-lookup.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly uploadManager: UploadManager,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    files: {
      [FileUploadEnum.Image]: Express.Multer.File[];
    },
  ) {
    const uploadedImage = await this.uploadManager.uploadFiles(files);

    try {
      return await this.categoryRepository.save({
        ...createCategoryDto,
        imgPath: uploadedImage[0].path || null,
      });
    } catch (e) {
      await this.uploadManager.cleanupFiles(uploadedImage);
      throw e;
    }
  }

  async createSyncBulk(createCategoryDto: CreateSyncCategoryDto[], files: Express.Multer.File[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (const category of createCategoryDto) {
      const categoryImage = getFilesBySyncId(files, FileUploadEnum.Image, category.syncId);

      try {
        const createdCategory = await this.create(category, { [FileUploadEnum.Image]: categoryImage });
        response.successes.push(createdCategory);
      } catch (err) {
        response.failures.push({
          syncId: category.syncId,
          errors: [err.sqlMessage],
        });
      }
    }

    return response;
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async findMany(filterDto: CategoryFilterDto, paginationDto: BasePaginationDto) {
    const filter = fromDtoToQuery(filterDto);

    const [row, count] = await this.categoryRepository.findAndCount({
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

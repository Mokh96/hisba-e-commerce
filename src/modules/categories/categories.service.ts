import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BulkResponseType } from 'src/common/types/bulk-response.type';
import { checkChildrenRecursive } from 'src/helpers/function.global';
import { Repository } from 'typeorm';
import { CreateCategoryDto, CreateSyncCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto, UpdateSyncCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { getFilesBySyncId } from 'src/modules/files/utils/file-lookup.util';
import { getAllDescendantIds } from 'src/common/utils/tree/get-all-descendant-Ids.util';
import { CategoryFilterDto } from 'src/modules/categories/dto/category-filter.dto';
import { QueryUtils } from 'src/common/utils/query-utils/query.utils';
import { PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';
import { formatCaughtException } from 'src/common/exceptions/helpers/format-caught-exception.helper';

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
        imgPath: uploadedImage[0]?.path || null,
      });
    } catch (e) {
      await this.uploadManager.cleanupFiles(uploadedImage);
      throw e;
    }
  }

  async createSyncBulk(createCategoryDto: CreateSyncCategoryDto[], files: Express.Multer.File[]) {
    const response: BulkResponseType = {
      successes: [],
      failures: [],
    };

    for (const category of createCategoryDto) {
      const categoryImage = getFilesBySyncId(files, FileUploadEnum.Image, category.syncId);

      try {
        const createdCategory = await this.create(category, { [FileUploadEnum.Image]: categoryImage });
        response.successes.push(createdCategory);
      } catch (error) {
        const formattedError = formatCaughtException(error);
        response.failures.push({
          syncId: category.syncId,
          error: formattedError,
        });
      }
    }

    return response;
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async findMany(paginationDto: PaginationDto, filterDto: CategoryFilterDto) {
    const queryBuilder = this.categoryRepository.createQueryBuilder(this.categoryRepository.metadata.tableName);

    QueryUtils.use(queryBuilder)
      .applySearch(filterDto.search)
      .applyFilters(filterDto.filters)
      .applyInFilters(filterDto.in)
      .applySelectFields(filterDto.fields)
      .applyDateFilters(filterDto.date)
      .applyPagination(paginationDto);

    const [data, totalItems] = await queryBuilder.getManyAndCount();
    return { totalItems, data };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    files: {
      [FileUploadEnum.Image]: Express.Multer.File[];
    },
  ) {
    if (updateCategoryDto.parentId) {
      if (updateCategoryDto.parentId === id)
        throw new BadRequestException('parent Id must be not children of this category');
      if (!checkChildrenRecursive(id, await this.findAll(), updateCategoryDto.parentId))
        throw new BadRequestException('parent Id must be not children of this category');
    }

    const category = await this.categoryRepository.findOneByOrFail({ id });

    const initialImgPath = category.imgPath;
    let uploadedFiles = [];
    let newPath: string | undefined;

    try {
      // Upload new files if provided
      uploadedFiles = await this.uploadManager.uploadFiles(files);
      newPath = uploadedFiles.length > 0 ? uploadedFiles[0].path : undefined;

      // Merge updates
      const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto, {
        imgPath: newPath ?? (updateCategoryDto.removeImage ? null : initialImgPath),
      });

      // Save the updated category
      const savedCategory = await this.categoryRepository.save(updatedCategory);

      // Remove old image if necessary
      if ((newPath && initialImgPath) || updateCategoryDto.removeImage) {
        await this.uploadManager.removeFile(initialImgPath);
      }

      return savedCategory;
    } catch (error) {
      await this.uploadManager.cleanupFiles(uploadedFiles);
      throw error;
    }
  }

  async remove(id: number) {
    const category = await this.categoryRepository.findOneByOrFail({ id });
    await this.uploadManager.removeFile(category.imgPath);
    return await this.categoryRepository.remove(category);
  }

  async updateBulk(updateCategoryDto: UpdateSyncCategoryDto[], files: Express.Multer.File[]) {
    const response: BulkResponseType = {
      successes: [],
      failures: [],
    };

    for (const updateCategory of updateCategoryDto) {
      const categoryImage = getFilesBySyncId(files, FileUploadEnum.Image, updateCategory.syncId);
      try {
        const category = await this.update(updateCategory.id, updateCategory, {
          [FileUploadEnum.Image]: categoryImage,
        });
        response.successes.push(category);
      } catch (error) {
        const formattedError = formatCaughtException(error);
        response.failures.push({
          syncId: updateCategory.syncId,
          error: formattedError,
        });
      }
    }
    return response;
  }

  async getCategoryDescendants(ids: Category['id'][]) {
    return await getAllDescendantIds(ids, this.categoryRepository);
  }
}

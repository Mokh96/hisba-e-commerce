import { Injectable } from '@nestjs/common';
import { CreateProductDto, CreateSyncProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateSyncProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { getMaxAndMinPrices } from 'src/common/utils/pricing-utils.util';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { UploadFileType } from 'src/modules/files/types/upload-file.type';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { BulkResponse, UpdateBulkResponse } from 'src/common/types/bulk-response.type';
import { getFileBySyncId, getFilesBySyncId } from 'src/modules/files/utils/file-lookup.util';
import { ProductGallery } from 'src/modules/product-galleries/entities/product-gallery.entity';
import { getEntitiesByIds } from 'src/common/utils/entity.utils';
import { Article } from 'src/modules/articles/entities/article.entity';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';
import { Order } from 'src/modules/orders/entities/order.entity';
import { ProductFilterDto } from './dto/product-filter.dto';
import { PaginationDto } from 'src/common/dtos/filters/pagination-query.dto';
import { QueryUtils } from 'src/common/utils/query.utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private uploadManager: UploadManager,
  ) {}

  async create(createProductDto: CreateProductDto, files: Express.Multer.File[]) {
    const allUploadedFiles: UploadFileType[] = [];

    try {
      // Step 1: Upload Product Image
      let defaultImgPath: Product['defaultImgPath'] = null;
      const productFile = getFileBySyncId(files, FileUploadEnum.DefaultImage, createProductDto.syncId);
      if (productFile) {
        const uploaded = await this.uploadManager.uploadFiles({ [FileUploadEnum.DefaultImage]: [productFile] });
        defaultImgPath = uploaded[0].path;
        allUploadedFiles.push(...uploaded);
      }

      // Step 2: Upload Product Gallery
      const productImages = getFilesBySyncId(files, FileUploadEnum.Image, createProductDto.syncId);
      let gallery: Pick<ProductGallery, 'path'>[] = [];
      if (productImages.length) {
        const uploadedImages = await this.uploadManager.uploadFiles({ [FileUploadEnum.Image]: productImages });
        gallery = uploadedImages.map((image) => ({ path: image.path }));
        allUploadedFiles.push(...uploadedImages);
      }

      // Step 3: Upload Articles' Images
      const articles: typeof createProductDto.articles & { imgPath: string }[] = [];
      for (const article of createProductDto.articles ?? []) {
        const articleImage = getFileBySyncId(files, FileUploadEnum.DefaultImage, article.syncId);
        let imgPath: Article['imgPath'] = null;

        if (articleImage) {
          const uploaded = await this.uploadManager.uploadFiles({ [FileUploadEnum.DefaultImage]: [articleImage] });
          imgPath = uploaded[0].path;
          allUploadedFiles.push(...uploaded);
        }

        articles.push({ ...article, imgPath });
      }

      // Step 4: Calculate Prices
      const { minPrice, maxPrice } = getMaxAndMinPrices(articles);

      // Step 5: Save product with cascade relations
      const product = this.productRepository.create({
        ...createProductDto,
        defaultImgPath,
        gallery,
        articles,
        minPrice,
        maxPrice,
      });

      return await this.productRepository.save(product);
    } catch (error) {
      await this.uploadManager.cleanupFiles(allUploadedFiles);
      throw error;
    }
  }

  async createBulk(createSyncProductsDto: CreateSyncProductDto[], files: Express.Multer.File[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (let i = 0; i < createSyncProductsDto.length; i++) {
      try {
        const product = await this.create(createSyncProductsDto[i], files);
        response.successes.push(product);
        //response.successes.push({ id: product.id, syncId: product.syncId });
      } catch (error) {
        response.failures.push({
          index: i,
          syncId: createSyncProductsDto[i].syncId,
          errors: error,
        });
      }
    }

    return response;
  }

  async findAll(paginationDto: PaginationDto, filterDto: ProductFilterDto): Promise<PaginatedResult<Product>> {
    const alias = this.productRepository.metadata.tableName; // or just manually set 'product'
    const queryBuilder = this.productRepository.createQueryBuilder(alias);
    console.log({
      filterDto: JSON.stringify(filterDto),
      fields: filterDto.fields,
      //paginationDto,
    });

    QueryUtils.use(queryBuilder)
      .applySearch(filterDto.search)
      .applyFilters(filterDto.filters)
      .applyGtFilters(filterDto.gt)
      .applyLtFilters(filterDto.lt)
      .applyGteFilters(filterDto.gte)
      .applyLteFilters(filterDto.lte)
      .applyInFilters(filterDto.in)
      .applySelectFields(filterDto.fields)
      .applyDateFilters({ createdAt: filterDto.createdAt, updatedAt: filterDto.updatedAt })
      .applyPagination(paginationDto);

    const [data, totalItems] = await queryBuilder.getManyAndCount();

    return { totalItems, data };
  }

  async findOne(id: number) {
    return await this.productRepository.findOneOrFail({
      where: { id },
      relations: {
        gallery: true,
        articles: { optionValues: { option: true } },
      },
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    files: { [FileUploadEnum.Image]: Express.Multer.File[] },
  ) {
    const product = await this.productRepository.findOneByOrFail({ id });
    const initialImgPath = product.defaultImgPath; // Get the initial image path

    const uploadedFiles = await this.uploadManager.uploadFiles(files); // Upload new image
    const newPath = uploadedFiles.length > 0 ? uploadedFiles[0].path : undefined;

    try {
      let updatedFields: Partial<Product> = { ...updateProductDto };
      if (newPath) {
        updatedFields.defaultImgPath = newPath; // Update with new image
      }

      const updatedProduct = this.productRepository.merge(product, updatedFields);
      await this.productRepository.save(updatedProduct);

      if (newPath && initialImgPath) {
        await this.uploadManager.removeFile(initialImgPath); //remove the old image
      }
      return updatedProduct;
    } catch (error) {
      await this.uploadManager.cleanupFiles(uploadedFiles);
      throw error;
    }
  }

  async updateBulk(updateSyncProductDto: UpdateSyncProductDto[], files: Express.Multer.File[]) {
    const response: UpdateBulkResponse = {
      successes: [],
      failures: [],
    };

    for (let i = 0; i < updateSyncProductDto.length; i++) {
      try {
        const productImage = getFilesBySyncId(files, FileUploadEnum.Image, updateSyncProductDto[i].syncId);
        const product = await this.update(updateSyncProductDto[i].id, updateSyncProductDto[i], {
          [FileUploadEnum.Image]: productImage,
        });
        response.successes.push(product);
        //response.successes.push({ id: product.id, syncId: product.syncId });
      } catch (error) {
        response.failures.push({
          index: i,
          id: updateSyncProductDto[i].id,
          errors: error,
        });
      }
    }

    return response;
  }

  public async getProductsByIds(articleIds: Product['id'][], options: FindManyOptions<Product> = {}) {
    return await getEntitiesByIds(this.productRepository, articleIds, options);
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneByOrFail({ id });
    return this.productRepository.remove(product);
  }
}

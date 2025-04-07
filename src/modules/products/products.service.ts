import {  Injectable } from '@nestjs/common';
import { CreateProductDto, CreateSyncProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateSyncProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { getMaxAndMinPrices } from 'src/common/utils/pricing-utils.util';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { Article } from 'src/modules/articles/entities/article.entity';
import { ArticleGallery } from 'src/modules/article-galleries/entities/article-gallery.entity';
import * as _ from 'lodash';
import { UploadFileType } from 'src/modules/files/types/upload-file.type';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { BulkResponse, UpdateBulkResponse } from 'src/common/types/bulk-response.type';
import { getFileByUid, getFilesByUid } from 'src/modules/files/utils/file-lookup.util';
import { CreateProductWithImagesDto } from 'src/modules/products/types/producuts.types';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
    private uploadManager: UploadManager,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { minPrice, maxPrice } = getMaxAndMinPrices(createProductDto.articles);
    const product = this.productRepository.create({
      ...createProductDto,
      minPrice,
      maxPrice,
    });
    await this.productRepository.save(product);
    return product;
  }

  async createProduct(createProductDto: CreateProductDto, files: Express.Multer.File[]) {
    const clonedCreatedProduct: CreateProductWithImagesDto = _.cloneDeep({
      ...createProductDto,
      imgPath: null,
      articles:
        createProductDto.articles?.map((article) => ({
          ...article,
          imgPath: null,
          gallery: [],
        })) ?? [],
    });

    //use this array to remove uploaded files from the server if there is an error
    const allUploadedFiles: UploadFileType[] = [];

    return this.dataSource.transaction(async (manager) => {
      try {
        // Step 1: Upload Product Image
        const productFile = getFileByUid(files, FileUploadEnum.Image, createProductDto._uid);
        if (productFile) {
          const uploadedProductImages = await this.uploadManager.uploadFiles({ [FileUploadEnum.Image]: [productFile] });
          clonedCreatedProduct.imgPath = uploadedProductImages[0].path;
          allUploadedFiles.push(...uploadedProductImages);
        }

        //Step 2: Upload Articles' Images
        for (const article of clonedCreatedProduct.articles) {
          const defaultImage = getFileByUid(files, FileUploadEnum.DefaultImage, article._uid);
          const articleImages = getFilesByUid(files, FileUploadEnum.Image, article._uid);

          /*if (!defaultImage) {
            throw new BadRequestException('Default image is required when uploading article images.');
          }*/

          // Upload default image

          const uploadedDefaultImage = await this.uploadManager.uploadFiles({
            [FileUploadEnum.DefaultImage]: [defaultImage],
          });
          article.imgPath = uploadedDefaultImage[0].path;
          allUploadedFiles.push(...uploadedDefaultImage);

          // Upload article gallery images (if any)
          if (articleImages.length > 0) {
            const uploadedArticleImages = await this.uploadManager.uploadFiles({
              [FileUploadEnum.Image]: articleImages,
            });
            article.gallery = uploadedArticleImages.map((image) => ({ path: image.path }));
            allUploadedFiles.push(...uploadedArticleImages);
          }
        }

        //Step 3: Save Product
        const { minPrice, maxPrice } = getMaxAndMinPrices(createProductDto.articles);
        console.log('before insert product', { ...clonedCreatedProduct, maxPrice, minPrice });
        const product = await manager.save(Product, {
          ...clonedCreatedProduct,
          minPrice,
          maxPrice,
        });

        //Step 4: Save Articles & Their Galleries
        for (let i = 0; i < clonedCreatedProduct.articles.length; i++) {
          const articleData = clonedCreatedProduct.articles[i];
          const article = await manager.save(Article, { ...articleData, product });

          if (articleData.gallery.length > 0) {
            const articleGalleries = articleData.gallery.map((image) => ({
              path: image.path,
              articleId: article.id,
              article,
            }));

            await manager.save(ArticleGallery, articleGalleries);
          }
        }

        return product;
      } catch (error) {
        await this.uploadManager.cleanupFiles(allUploadedFiles); // Cleanup uploaded files if transaction fails
        throw error;
      }
    });
  }

  async createBulk(createSyncProductsDto: CreateSyncProductDto[], files: Express.Multer.File[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    console.log(createSyncProductsDto);
    for (let i = 0; i < createSyncProductsDto.length; i++) {
      try {
        const product = await this.createProduct(createSyncProductsDto[i], files);
        console.log('created product', product);
        response.successes.push(product);
        //response.successes.push({ id: product.id, syncId: product.syncId });
      } catch (error) {
        console.log('error', error);
        response.failures.push({
          index: i,
          syncId: createSyncProductsDto[i].syncId,
          errors: error,
        });
      }
    }

    return response;
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    return await this.productRepository.findOneOrFail({
      where: { id },
      relations: {
        articles: { gallery: true, optionValues: { option: true } },
      },
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    files: { [FileUploadEnum.Image]: Express.Multer.File[] },
  ) {
    const product = await this.productRepository.findOneByOrFail({ id });
    const initialImgPath = product.imgPath; // Get the initial image path

    const uploadedFiles = await this.uploadManager.uploadFiles(files); // Upload new image
    const newPath = uploadedFiles.length > 0 ? uploadedFiles[0].path : undefined;

    try {
      let updatedFields: Partial<Product> = { ...updateProductDto };
      if (newPath) {
        updatedFields.imgPath = newPath; // Update with new image
      }

      const updatedProduct = this.productRepository.merge(product, updatedFields);
      await this.productRepository.save(updatedProduct);

      if (newPath && initialImgPath) {
        await this.uploadManager.removeFile(initialImgPath);
      }
      return updatedProduct;
    } catch (error) {
      console.log('error', error);
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
        const productImage = getFilesByUid(files, FileUploadEnum.Image, updateSyncProductDto[i]._uid);
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

  async remove(id: number) {
    const product = await this.productRepository.findOneByOrFail({ id });
    return this.productRepository.remove(product);
  }
}

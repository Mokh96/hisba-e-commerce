import { Injectable } from '@nestjs/common';
import { CreateProductDto, CreateSyncProductDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateSyncProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { getMaxAndMinPrices } from 'src/common/utils/pricing-utils.util';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { Article } from 'src/modules/articles/entities/article.entity';
import * as _ from 'lodash';
import { UploadFileType } from 'src/modules/files/types/upload-file.type';
import { UploadManager } from 'src/modules/files/upload/upload-manager';
import { BulkResponse, UpdateBulkResponse } from 'src/common/types/bulk-response.type';
import { getFileBySyncId, getFilesBySyncId } from 'src/modules/files/utils/file-lookup.util';
import { CreateProductWithImagesDto } from 'src/modules/products/types/producuts.types';
import { ProductGallery } from 'src/modules/product-galleries/entities/product-gallery.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
    private uploadManager: UploadManager,
  ) {}

  async create(createProductDto: CreateProductDto, files: Express.Multer.File[]) {
    const clonedCreatedProduct: CreateProductWithImagesDto = _.cloneDeep({
      ...createProductDto,
      defaultImgPath: null,
      gallery: [],
      articles:
        createProductDto.articles?.map((article) => ({
          ...article,
          imgPath: null,
        })) ?? [],
    });

    //use this array to remove uploaded files from the server if there is an error
    const allUploadedFiles: UploadFileType[] = [];

    return this.dataSource.transaction(async (manager) => {
      try {
        // Step 1: Upload Product Image
        const productFile = getFileBySyncId(files, FileUploadEnum.DefaultImage, createProductDto.syncId);
        if (productFile) {
          const uploadedProductImages = await this.uploadManager.uploadFiles({
            [FileUploadEnum.DefaultImage]: [productFile],
          });
          clonedCreatedProduct.defaultImgPath = uploadedProductImages[0].path;
          allUploadedFiles.push(...uploadedProductImages);
        }

        //step 2: Upload Product Gallery
        const productImages = getFilesBySyncId(files, FileUploadEnum.Image, createProductDto.syncId);
        if (productImages.length > 0) {
          const uploadedProductImages = await this.uploadManager.uploadFiles({
            [FileUploadEnum.Image]: productImages,
          });
          clonedCreatedProduct.gallery = uploadedProductImages.map((image) => ({ path: image.path }));
          allUploadedFiles.push(...uploadedProductImages);
        }

        //Step 2: Upload Articles' Images
        for (const article of clonedCreatedProduct.articles) {
          const defaultArticleImage = getFileBySyncId(files, FileUploadEnum.DefaultImage, article.syncId);

          const uploadedDefaultImage = await this.uploadManager.uploadFiles({
            [FileUploadEnum.DefaultImage]: [defaultArticleImage],
          });
          article.imgPath = uploadedDefaultImage[0].path;
          allUploadedFiles.push(...uploadedDefaultImage);
        }

        //Step 3: Save Product
        const { minPrice, maxPrice } = getMaxAndMinPrices(createProductDto.articles);
        const product = await manager.save(Product, {
          ...clonedCreatedProduct,
          minPrice,
          maxPrice,
        });

        if (product.gallery.length > 0) {
          const productGalleries = product.gallery.map((image) => ({
            path: image.path,
            productId: product.id,
            product,
          }));

          await manager.save(ProductGallery, productGalleries);
        }

        //Step 4: Save Articles
        for (const article of clonedCreatedProduct.articles) {
          await manager.save(Article, { ...article, product });
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

  async findAll() {
    return await this.productRepository.find();
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
        await this.uploadManager.removeFile(initialImgPath);
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

  async remove(id: number) {
    const product = await this.productRepository.findOneByOrFail({ id });
    return this.productRepository.remove(product);
  }
}

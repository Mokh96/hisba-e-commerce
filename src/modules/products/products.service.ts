import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto, CreateSyncProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { getMaxAndMinPrices } from 'src/common/utils/pricing-utils';
import { FileUploadEnum } from 'src/modules/files/enums/file-upload.enum';
import { Article } from 'src/modules/articles/entities/article.entity';
import { ArticleGallery } from 'src/modules/article-galleries/entities/article-gallery.entity';
import * as _ from 'lodash';
import { UploadFileType } from 'src/modules/files/types/upload-file.type';
import { UploadManager3 } from 'src/modules/files/upload/upload-manager';
import { FileTypesEnum } from 'src/modules/files/enums/file-types.enum';
import { getFileByUid, getFilesByUid } from 'src/modules/files/utils/file-lookup.util';
import { BulkResponse } from 'src/common/types/bulk-response.type';

@Injectable()
export class ProductsService extends UploadManager3 {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource, // Required for transactions
  ) {
    super(FileTypesEnum.Public, ['service']);
  }

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
    const clonedCreatedProduct: CreateProductDto & { imgPath: string } & {
      articles: CreateProductDto['articles'] & { imgPath: string; gallery: Pick<ArticleGallery, 'path'>[] }[];
    } = _.cloneDeep({
      ...createProductDto,
      imgPath: null,
      articles: createProductDto.articles.map((article) => ({
        ...article,
        imgPath: null,
        gallery: [],
      })),
    });

    //use this array to remove uploaded files from the server if there is an error
    const allUploadedFiles: UploadFileType[] = [];

    return this.dataSource.transaction(async (manager) => {
      try {
        // Step 1: Upload Product Image
        const productFile = getFileByUid(files, FileUploadEnum.Image, createProductDto._uid);
        if (productFile) {
          const uploadedProductImages = await this.uploadFiles({ [FileUploadEnum.Image]: [productFile] });
          clonedCreatedProduct.imgPath = uploadedProductImages[0].path;
          allUploadedFiles.push(...uploadedProductImages);
        }

        //Step 2: Upload Articles' Images
        for (const article of clonedCreatedProduct.articles) {
          const defaultImage = getFileByUid(files, FileUploadEnum.DefaultImage, article._uid);
          const articleImages = getFilesByUid(files, FileUploadEnum.Image, article._uid);

          if (!defaultImage) {
            throw new BadRequestException('Default image is required when uploading article images.');
          }

          // Upload default image

          const uploadedDefaultImage = await this.uploadFiles({ [FileUploadEnum.DefaultImage]: [defaultImage] });
          article.imgPath = uploadedDefaultImage[0].path;
          allUploadedFiles.push(...uploadedDefaultImage);

          // Upload article gallery images (if any)
          if (articleImages.length > 0) {
            const uploadedArticleImages = await this.uploadFiles({ [FileUploadEnum.Image]: articleImages });
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
        await this.cleanupFiles(allUploadedFiles); // Cleanup uploaded files if transaction fails
        throw error;
      }
    });
  }

  async createProductsBulk(createSyncProductDtos: CreateSyncProductDto[], files: Express.Multer.File[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (let i = 0; i < createSyncProductDtos.length; i++) {
      try {
        const product = await this.createProduct(createSyncProductDtos[i], files);
        response.successes.push(product);
        //response.successes.push({ id: product.id, syncId: product.syncId });
        //console.log(product);
      } catch (error) {
        console.log(error);
        response.failures.push({
          index: i,
          syncId: createSyncProductDtos[i].syncId,
          errors: error,
        });
      }
    }

    return response;
  }

  async createBulk(createSyncProductDtos: CreateSyncProductDto[]) {
    const baseFailures = [];
    const success: Product[] = [];

    for (let i = 0; i < createSyncProductDtos.length; i++) {
      try {
        const product = await this.productRepository.save(createSyncProductDtos[i]);
        success.push(product);
      } catch (error) {
        baseFailures.push({
          syncId: createSyncProductDtos[i].syncId,
          error,
        });
      }
    }

    return { success, baseFailures };
  }

  async findAll() {
    return await this.productRepository.find();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneOrFail({
      where: { id },
      relations: {
        articles: { gallery: true, optionValues: { option: true } },
      },
    });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneByOrFail({ id });

    const updatedProduct = this.productRepository.merge(product, updateProductDto);
    await this.productRepository.save(updatedProduct);
    return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneByOrFail({ id });

    await this.productRepository.remove(product);
    return true;
  }
}

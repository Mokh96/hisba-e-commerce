import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateProductDto,
  CreateSyncProductDto,
} from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { Article } from '../articles/entities/article.entity';
import { Lot } from '../lots/entities/lot.entity';
import { CreateArticleDto } from '../articles/dto/create-article.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,

    // @InjectRepository(Article)
    // private articleRepository: Repository<Article>,

    private dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateSyncProductDto) {
    //   const articles = createProductDto.articles as any;
    //   delete createProductDto.articles;
    //   const product = this.productRepository.create(createProductDto);
    //   await this.productRepository.save(product);
    //   const listArticles = articles.map(
    //     (article) => (article.productId = product.id),
    //   );
    //   const _articles = this.articleRepository.create(listArticles);
    //   this.articleRepository.save(_articles);
    //   return product;
  }
  async creat(createProductDto: CreateSyncProductDto) {
    const product = this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    return product;

    const priceList = product.articles
      ?.map(({ lots }) => lots?.map(({ price }) => price))
      .flat();

    //if (priceList) product = this.maxMin(product, priceList);

    //return product;

    await this.productRepository.save(product);

    return product;
  }

  async createBulk(createSyncProductDtos: CreateSyncProductDto[]) {
    const baseFailures = [];
    const success: Product[] = [];

    for (let i = 0; i < createSyncProductDtos.length; i++) {
      try {
        const product = await this.productRepository.save(
          createSyncProductDtos[i],
        );
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
    const products = await this.productRepository.find();
    return products;
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneOrFail({
      where: { id },
      relations: {
        articles: { gallery: true, optionValues: { option: true }, lots: true },
        gallery: true,
      },
    });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOneByOrFail({ id });

    const updatedProduct = this.productRepository.merge(
      product,
      updateProductDto,
    );
    await this.productRepository.save(updatedProduct);
    return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.productRepository.findOneByOrFail({ id });

    await this.productRepository.remove(product);
    return true;
  }

  public maxMin(product: Product, prices: number[]) {
    if (prices.length === 1 && (product.minPrice && product.maxPrice) == 0) {
      product.maxPrice = prices[0];
      product.minPrice = prices[0];
    } else
      prices.forEach((price) => {
        if (price < product.minPrice) product.minPrice = price;
        else if (price > product.maxPrice) product.maxPrice = price;
      });

    return product;
  }
}

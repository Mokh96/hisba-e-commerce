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

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Product)
    private articleRepository: Repository<Article>,

    private dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateSyncProductDto) {
    const articlesDto = createProductDto.articles;
    const articles = this.articleRepository.create(articlesDto);

    let product = this.productRepository.create(createProductDto);
    product.articles = articles;

    const priceList = articles
      ?.map(({ lots }) => lots?.map(({ price }) => price))
      .flat();

    if (priceList) product = this.maxMin(product, priceList);

    //return product;

    await this.productRepository.save(createProductDto);

    return product;
  }

  async createBulk(createSyncProductDto: CreateSyncProductDto[]) {
    // let product = this.productRepository.create(createProductDto);
    // const priceList = product.articles
    //   ?.map(({ lots }) => lots?.map(({ price }) => price))
    //   .flat();

    // if (priceList) product = this.maxMin(product, priceList);

    // //return product;

    // await this.productRepository.save(product);
    // // await this.dataSource.transaction(async (manger) => {
    // //   await manger.getRepository(Product).save(product);
    // // });

    return 'need to implement';
  }

  async findAll() {
    const products = await this.productRepository.find();
    return products;
  }

  async findById(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findOne(id: number) {
    await this.findById(id);
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { articles: { optionValues: true } },
    });

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    let product = await this.findById(id);

    const updatedProduct = this.productRepository.merge(
      product,
      updateProductDto,
    );
    await this.productRepository.save(updatedProduct);
    return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.findById(id);
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

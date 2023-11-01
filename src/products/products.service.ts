import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    let product = this.productRepository.create(createProductDto);
    const priceList = product.articles
      ?.map(({ lots }) => lots?.map(({ price }) => price))
      .flat();

    if (priceList) product = this.maxMin(product, priceList);

    await this.productRepository.save(product);
    return product;
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

  maxMin(product: Product, prices: number[]) {
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

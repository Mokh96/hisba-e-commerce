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
    const product = this.productRepository.create(createProductDto);
    product.minPrice = '0';
    product.maxPrice = '1';
    await this.productRepository.save(product);
    return product;
  }

  async findAll() {
    const products = await this.productRepository.find();
    return products;
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    let product = await this.findOne(id);
    const updatedProduct = this.productRepository.merge(
      product,
      updateProductDto,
    );
    await this.productRepository.save(updatedProduct);
    return updatedProduct;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return true;
  }
}

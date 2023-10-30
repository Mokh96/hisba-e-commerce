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
}

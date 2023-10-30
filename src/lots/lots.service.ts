import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { Lot } from './entities/lot.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private lotRepository: Repository<Lot>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  async create(createLotDto: CreateLotDto) {
    const lot = this.lotRepository.create(createLotDto);
    const product = await this.productRepository.findOneOrFail({
      where: { articles: { id: createLotDto.articleId } },
      //relations: ['articles'],
    });

    console.log(product.minPrice);

    if (product.minPrice === 0) {
      product.minPrice = lot.price;
      product.maxPrice = lot.price;
    } else if (product.minPrice < lot.price) product.minPrice = lot.price;
    else if (product.maxPrice > lot.price) product.maxPrice = lot.price;

    console.log({ after: { min: product.minPrice, max: product.maxPrice } });

    this.dataSource.transaction(async (manger) => {
      await manger.getRepository(Product).save(product);
      await manger.getRepository(Lot).save(lot);
    });
    // await this.productRepository.save(product);
    // await this.lotRepository.save(lot);

    return lot;
  }

  async findAll() {
    const lots = await this.lotRepository.find();
    return lots;
  }

  async findOne(id: number) {
    const lot = await this.lotRepository.findOneBy({ id });
    if (!lot) throw new NotFoundException('Lot not found');
    return lot;
  }

  async update(id: number, updateLotDto: UpdateLotDto) {
    let lot = await this.findOne(id);
    const updatedLot = this.lotRepository.merge(lot, updateLotDto);
    await this.lotRepository.save(updatedLot);
    return updatedLot;
  }

  async remove(id: number) {
    const lot = await this.findOne(id);
    await this.lotRepository.remove(lot);
    return true;
  }
}

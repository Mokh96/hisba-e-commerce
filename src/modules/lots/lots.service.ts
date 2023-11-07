import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { Lot } from './entities/lot.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/modules/products/entities/product.entity';
import { ProductsService } from 'src/modules/products/products.service';
import { CreateSyncLotDto } from './dto/create-lot.dto';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private lotRepository: Repository<Lot>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
    private productsService: ProductsService,
  ) {}

  async create(createLotDto: CreateSyncLotDto) {
    const lot = this.lotRepository.create(createLotDto);
    await this.saveLot(lot);
    return lot;
  }

  async createBulk(createSyncLotDtos: CreateSyncLotDto[]) {
    const lots = this.lotRepository.create(createSyncLotDtos);

    const listOfErrors = [];
    for (const lot of lots) {
      try {
        await this.saveLot(lot);
      } catch (error) {
        listOfErrors.push(error);
      }
    }

    if (listOfErrors.length > 0) return listOfErrors;

    return lots;
  }

  async findAll() {
    const lots = await this.lotRepository.find();
    return lots;
  }

  async findOne(id: number) {
    const lot = await this.lotRepository.findOneByOrFail({ id });
    return lot;
  }

  async update(id: number, updateLotDto: UpdateLotDto) {
    const lot = await this.findOne(id);
    const updatedLot = this.lotRepository.merge(lot, updateLotDto);

    await this.saveLot(lot);
    return updatedLot;
  }

  async remove(id: number) {
    const lot = await this.findOne(id);
    await this.lotRepository.remove(lot);
    return true;
  }

  private async saveLot(lot: Lot) {
    let product = await this.productRepository.findOneOrFail({
      where: { articles: { id: lot.articleId } },
    });

    product = this.productsService.maxMin(product, [lot.price]);

    await this.dataSource.transaction(async (manger) => {
      await manger.getRepository(Product).save(product);
      await manger.getRepository(Lot).save(lot);
    });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateLotDto, UpdateSyncLotDto } from './dto/update-lot.dto';
import { Lot } from './entities/lot.entity';
import { DataSource, In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/modules/products/entities/product.entity';
import { ProductsService } from 'src/modules/products/products.service';
import { CreateSyncLotDto } from './dto/create-lot.dto';
import { QueryLotDto } from './dto/query-lot.dto';
import { QueryHelper } from 'src/helpers/query.helper';
import { fromDtoToQuery } from 'src/helpers/function.global';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private lotRepository: Repository<Lot>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private dataSource: DataSource,
    private productsService: ProductsService,
    private queryHelper: QueryHelper,
  ) {}

  async create(createLotDto: CreateSyncLotDto) {
    const lot = this.lotRepository.create(createLotDto);
    await this.saveLot(lot);
    return lot;
  }

  async createBulk(createSyncLotDtos: CreateSyncLotDto[]) {
    const lots = this.lotRepository.create(createSyncLotDtos);

    const baseFailures = [];
    const success: Lot[] = [];

    for (let i = 0; i < lots.length; i++) {
      try {
        const lot = await this.saveLot(lots[i]);
        success.push(lot);
      } catch (error) {
        baseFailures.push({
          syncId: lots[i].syncId,
          error,
        });
      }
    }

    return { success, baseFailures };
  }

  async findAll(queryLotDto: QueryLotDto) {
    const queryLot = fromDtoToQuery(queryLotDto);

    const lots = await this.lotRepository.findBy(queryLot);
    return lots;
  }

  async findOne(id: number) {
    const lot = await this.lotRepository.findOneByOrFail({ id });
    return lot;
  }

  async update(id: number, updateLotDto: UpdateSyncLotDto) {
    const lot = await this.lotRepository.findOneByOrFail({ id });
    const updatedLot = this.lotRepository.merge(lot, updateLotDto);

    await this.saveLot(lot);
    return updatedLot;
  }

  async remove(id: number) {
    const lot = await this.lotRepository.findOneByOrFail({ id });
    await this.removeLot(lot);
    return true;
  }

  private async saveLot(lot: Lot) {
    let product = await this.productRepository.findOneOrFail({
      where: { articles: { id: lot.articleId } },
    });

    product = this.productsService.maxMin(product, [lot.price]);

    await this.dataSource.transaction(async (manger) => {
      await manger.getRepository(Product).save(product);
      return await manger.getRepository(Lot).save(lot);
    });

    return lot;
  }

  private async removeLot(lot: Lot) {
    let product = await this.productRepository.findOneOrFail({
      where: { articles: { id: lot.articleId } },
    });

    if (product.maxPrice == lot.price || product.maxPrice == lot.price) {
      const lots = await this.lotRepository.find({
        where: { article: { productId: product.id }, id: Not(lot.id) },
        select: ['price'],
      });

      product = this.productsService.maxMin(
        product,
        lots.map(({ price }) => price),
      );
    }

    await this.dataSource.transaction(async (manger) => {
      await manger.getRepository(Product).save(product);
      return await manger.getRepository(Lot).remove(lot);
    });
  }
}

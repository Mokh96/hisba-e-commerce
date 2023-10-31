import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLotDto } from './dto/create-lot.dto';
import { UpdateLotDto } from './dto/update-lot.dto';
import { Lot } from './entities/lot.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LotsService {
  constructor(
    @InjectRepository(Lot)
    private lotRepository: Repository<Lot>,
  ) {}

  async create(createLotDto: CreateLotDto) {
    const lot = this.lotRepository.create(createLotDto);
    await this.lotRepository.save(lot);
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
    const lot = await this.findOne(id);
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

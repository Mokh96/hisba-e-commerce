import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Town } from 'src/modules/towns/entities/town.entity';

@Injectable()
export class TownsService {
  constructor(@InjectRepository(Town) private townRepository: Repository<Town>) {}

  async findAll() {
    return await this.townRepository.find();
  }

  async findOne(id: number) {
    return await this.townRepository.findOneBy({ id });
  }
}

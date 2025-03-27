import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Wilaya } from 'src/modules/wilayas/entities/wilaya.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class WilayasService {
  constructor(@InjectRepository(Wilaya) private wilayaRepository: Repository<Wilaya>) {}

  findAll() {
    return this.wilayaRepository.find();
  }

  findOne(id: number) {
    return this.wilayaRepository.findOneBy({ id });
  }
}

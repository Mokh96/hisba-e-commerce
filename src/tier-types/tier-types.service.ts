import { Injectable } from '@nestjs/common';
import { CreateTierTypeDto } from './dto/create-tier-type.dto';
import { UpdateTierTypeDto } from './dto/update-tier-type.dto';

@Injectable()
export class TierTypesService {
  create(createTierTypeDto: CreateTierTypeDto) {
    return 'This action adds a new tierType';
  }

  findAll() {
    return `This action returns all tierTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tierType`;
  }

  update(id: number, updateTierTypeDto: UpdateTierTypeDto) {
    return `This action updates a #${id} tierType`;
  }

  remove(id: number) {
    return `This action removes a #${id} tierType`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateProspectiveTierDto } from './dto/create-prospective-tier.dto';
import { UpdateProspectiveTierDto } from './dto/update-prospective-tier.dto';

@Injectable()
export class ProspectiveTiersService {
  create(createProspectiveTierDto: CreateProspectiveTierDto) {
    return 'This action adds a new prospectiveTier';
  }

  findAll() {
    return `This action returns all prospectiveTiers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prospectiveTier`;
  }

  update(id: number, updateProspectiveTierDto: UpdateProspectiveTierDto) {
    return `This action updates a #${id} prospectiveTier`;
  }

  remove(id: number) {
    return `This action removes a #${id} prospectiveTier`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateRapportDto } from './dto/create-rapport.dto';
import { UpdateRapportDto } from './dto/update-rapport.dto';

@Injectable()
export class RapportsService {
  create(createRapportDto: CreateRapportDto) {
    return 'This action adds a new rapport';
  }

  findAll() {
    return `This action returns all rapports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rapport`;
  }

  update(id: number, updateRapportDto: UpdateRapportDto) {
    return `This action updates a #${id} rapport`;
  }

  remove(id: number) {
    return `This action removes a #${id} rapport`;
  }
}

import { Injectable } from '@nestjs/common';
import { CreateOptionsValueDto } from './dto/create-options-value.dto';
import { UpdateOptionsValueDto } from './dto/update-options-value.dto';

@Injectable()
export class OptionsValuesService {
  create(createOptionsValueDto: CreateOptionsValueDto) {
    return 'This action adds a new optionsValue';
  }

  findAll() {
    return `This action returns all optionsValues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} optionsValue`;
  }

  update(id: number, updateOptionsValueDto: UpdateOptionsValueDto) {
    return `This action updates a #${id} optionsValue`;
  }

  remove(id: number) {
    return `This action removes a #${id} optionsValue`;
  }
}

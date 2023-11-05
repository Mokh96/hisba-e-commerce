import { Injectable } from '@nestjs/common';
import { CreateDelegateDto } from './dto/create-delegate.dto';
import { UpdateDelegateDto } from './dto/update-delegate.dto';

@Injectable()
export class DelegatesService {
  create(createDelegateDto: CreateDelegateDto) {
    return 'This action adds a new delegate';
  }

  findAll() {
    return `This action returns all delegates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} delegate`;
  }

  update(id: number, updateDelegateDto: UpdateDelegateDto) {
    return `This action updates a #${id} delegate`;
  }

  remove(id: number) {
    return `This action removes a #${id} delegate`;
  }
}

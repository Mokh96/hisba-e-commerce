import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option } from './entities/option.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {}

  async create(createOptionDto: CreateOptionDto) {
    const option = this.optionRepository.create(createOptionDto);
    await this.optionRepository.save(option);
    return option;
  }

  async findAll() {
    const options = await this.optionRepository.find();
    return options;
  }

  async findOne(id: number) {
    const option = await this.optionRepository.findOneBy({ id });
    if (!option) throw new NotFoundException('Option not found');
    return option;
  }

  async update(id: number, updateOptionDto: UpdateOptionDto) {
    const option = await this.findOne(id);
    const updatedOption = this.optionRepository.merge(
      option,
      updateOptionDto,
    );
    await this.optionRepository.save(updatedOption);
    return updatedOption;
  }

  async remove(id: number) {
    const option = await this.findOne(id);
    await this.optionRepository.remove(option);
    return true;
  }
}

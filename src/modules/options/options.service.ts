import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BulkResponse } from 'src/common/types/bulk-response.type';
import { Repository } from 'typeorm';
import { CreateOptionDto, CreateOptionSyncDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option } from './entities/option.entity';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private optionRepository: Repository<Option>,
  ) {}

  async create(createOptionDto: CreateOptionDto | CreateOptionSyncDto) {
    const option = this.optionRepository.create(createOptionDto);
    await this.optionRepository.save(option);
    return option;
  }

  async createBulk(createOptionDto: CreateOptionSyncDto[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (const option of createOptionDto) {
      try {
        const newOption = this.optionRepository.create(option);
        await this.optionRepository.save(newOption);
        response.successes.push({
          id: newOption.id,
          syncId: newOption.syncId,
        });
      } catch (err) {
        response.failures.push({
          syncId: option.syncId,
          errors: [err.sqlMessage],
        });
      }
    }

    return response;
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
    const updatedOption = this.optionRepository.merge(option, updateOptionDto);
    await this.optionRepository.save(updatedOption);
    return updatedOption;
  }

  async remove(id: number) {
    const option = await this.findOne(id);
    await this.optionRepository.remove(option);
    return true;
  }
}

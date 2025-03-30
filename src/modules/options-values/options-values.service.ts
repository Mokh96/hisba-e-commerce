import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionsValueDto, CreateOptionValueSyncDto } from './dto/create-options-value.dto';
import { UpdateOptionsValueDto } from './dto/update-options-value.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OptionsValue } from './entities/options-value.entity';
import { BulkResponse } from 'src/common/types/bulk-response.type';

@Injectable()
export class OptionsValuesService {
  constructor(
    @InjectRepository(OptionsValue)
    private optionsValueRepository: Repository<OptionsValue>,
  ) {}

  async create(createOptionsValueDto: CreateOptionsValueDto) {
    const optionsValue = this.optionsValueRepository.create(createOptionsValueDto);
    await this.optionsValueRepository.save(optionsValue);
    return optionsValue;
  }

  async createBulk(createOptionValueSyncDto: CreateOptionValueSyncDto[]) {
    const response: BulkResponse = {
      successes: [],
      failures: [],
    };

    for (const brand of createOptionValueSyncDto) {
      try {
        const newOption = this.optionsValueRepository.create(brand);
        await this.optionsValueRepository.save(newOption);
        response.successes.push(newOption);
      } catch (err) {
        response.failures.push({
          syncId: brand.syncId,
          errors: [err.sqlMessage],
        });
      }
    }

    return response;
  }

  async findAll() {
    const optionsValues = await this.optionsValueRepository.find();
    return optionsValues;
  }

  async findOne(id: number) {
    const optionsValue = await this.optionsValueRepository.findOneBy({ id });
    if (!optionsValue) throw new NotFoundException('optionsValue not found');
    return optionsValue;
  }

  async update(id: number, updateOptionsValueDto: UpdateOptionsValueDto) {
    const optionsValue = await this.findOne(id);
    const updatedOptionsValue = this.optionsValueRepository.merge(optionsValue, updateOptionsValueDto);
    await this.optionsValueRepository.save(updatedOptionsValue);
    return updatedOptionsValue;
  }

  async remove(id: number) {
    const optionsValue = await this.findOne(id);
    await this.optionsValueRepository.remove(optionsValue);
    return true;
  }
}

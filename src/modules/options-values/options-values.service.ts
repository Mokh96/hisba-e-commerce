import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  BulkResponseType } from 'src/common/types/bulk-response.type';
import { Repository } from 'typeorm';
import { CreateOptionsValueDto, CreateOptionValueSyncDto } from './dto/create-options-value.dto';
import { UpdateOptionsValueDto } from './dto/update-options-value.dto';
import { OptionsValue } from './entities/options-value.entity';
import { formatCaughtException } from 'src/common/exceptions/helpers/format-caught-exception.helper';

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
    const response: BulkResponseType = {
      successes: [],
      failures: [],
    };

    for (const option of createOptionValueSyncDto) {
      try {
        const newOption = this.optionsValueRepository.create(option);
        await this.optionsValueRepository.save(newOption);
        response.successes.push({
          id: newOption.id,
          syncId: newOption.syncId,
        });
      } catch (error : unknown) {
        const formattedError = formatCaughtException(error);
        response.failures.push({
          syncId: option.syncId,
          error: formattedError
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

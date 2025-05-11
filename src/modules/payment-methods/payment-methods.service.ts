import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  BulkResponseType } from 'src/common/types/bulk-response.type';
import { Repository } from 'typeorm';
import { CreatePaymentMethodDto, CreateSyncPaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';
import { formatCaughtException } from 'src/common/exceptions/helpers/format-caught-exception.helper';

@Injectable()
export class PaymentMethodsService {
  constructor(@InjectRepository(PaymentMethod) private paymentMethodRepository: Repository<PaymentMethod>) {}
  async create(createPaymentMethodDto: CreatePaymentMethodDto | CreateSyncPaymentMethodDto) {
    return await this.paymentMethodRepository.save(createPaymentMethodDto);
  }

  async createBulk(createOptionValueSyncDto: CreateSyncPaymentMethodDto[]) {
    const response: BulkResponseType = {
      successes: [],
      failures: [],
    };

    for (const option of createOptionValueSyncDto) {
      try {
        const newMethod = this.paymentMethodRepository.create(option);
        await this.paymentMethodRepository.save(newMethod);
        response.successes.push({
          id: newMethod.id,
          syncId: newMethod.syncId,
        });
      } catch (error) {
        const formattedError = formatCaughtException(error);
        response.failures.push({
          syncId: option.syncId,
          error: formattedError,
        });
      }
    }

    return response;
  }

  async findAll() {
    return await this.paymentMethodRepository.find();
  }

  async findOne(id: number) {
    return await this.paymentMethodRepository.findOneBy({ id });
  }

  async update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return await this.paymentMethodRepository.update(id, updatePaymentMethodDto);
  }

  async remove(id: number) {
    return await this.paymentMethodRepository.delete(id);
  }
}

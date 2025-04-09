import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BulkResponse } from 'src/common/types/bulk-response.type';
import { Repository } from 'typeorm';
import { CreatePaymentMethodDto, CreateSyncPaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodsService {
  constructor(@InjectRepository(PaymentMethod) private paymentMethodRepository: Repository<PaymentMethod>) {}
  async create(createPaymentMethodDto: CreatePaymentMethodDto | CreateSyncPaymentMethodDto) {
    return await this.paymentMethodRepository.save(createPaymentMethodDto);
  }

  async createBulk(createOptionValueSyncDto: CreateSyncPaymentMethodDto[]) {
    const response: BulkResponse = {
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

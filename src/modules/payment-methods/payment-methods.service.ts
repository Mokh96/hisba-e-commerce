import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethod } from './entities/payment-method.entity';

@Injectable()
export class PaymentMethodsService {
  constructor(@InjectRepository(PaymentMethod) private paymentMethodRepository: Repository<PaymentMethod>) {}
  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    return await this.paymentMethodRepository.save(createPaymentMethodDto);
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

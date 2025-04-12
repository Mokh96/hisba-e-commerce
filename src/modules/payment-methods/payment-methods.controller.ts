import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { Role } from 'src/common/decorators';
import { Roles } from 'src/common/enums/roles.enum';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodsService } from './payment-methods.service';

@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  @Role(Roles.COMPANY, Roles.SUPERADMIN)
  async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    return await this.paymentMethodsService.create(createPaymentMethodDto);
  }

  @Get()
  async findAll() {
    return await this.paymentMethodsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.paymentMethodsService.findOne(+id);
  }

  @Patch(':id')
  @Role(Roles.COMPANY, Roles.SUPERADMIN)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return await this.paymentMethodsService.update(+id, updatePaymentMethodDto);
  }

  @Delete(':id')
  @Role(Roles.COMPANY, Roles.SUPERADMIN)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.paymentMethodsService.remove(+id);
  }
}

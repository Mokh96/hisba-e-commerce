import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { IsArrayPipe } from 'src/common/pipes/isArray.pipe';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';
import { validateBulkDto } from 'src/helpers/validation/validate-bulk-dto';
import { CreateSyncPaymentMethodDto } from './dto/create-payment-method.dto';
import { PaymentMethodsService } from './payment-methods.service';

@Controller('payment-methods/sync')
export class PaymentMethodSyncController {
  constructor(private paymentService: PaymentMethodsService) {}

  @Post()
  async sync(@Body() createPaymentMethodSyncDto: CreateSyncPaymentMethodDto) {
    return this.paymentService.create(createPaymentMethodSyncDto);
  }

  @Post('bulk')
  async syncBulk(
    @Res() res: Response,
    @Body(IsArrayPipe)
    createPaymentMethodDto: CreateSyncPaymentMethodDto[],
  ) {
    const { valFailures, valSuccess } = await validateBulkDto<CreateSyncPaymentMethodDto>(
      createPaymentMethodDto,
      CreateSyncPaymentMethodDto,
    );
    const { successes, failures } = await this.paymentService.createBulk(valSuccess);

    const result = {
      successes,
      failures: [...valFailures, ...failures],
    };

    const status = getBulkStatus({ failures: result.failures.length, success: result.successes.length });

    res.status(status).json(result);
  }
}

import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { IsArrayPipe } from 'src/common/pipes/isArray.pipe';
import { validateBulkDto } from 'src/helpers/validation/validate-bulk-dto';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';
import { CreateOptionValueSyncDto } from 'src/modules/options-values/dto/create-options-value.dto';
import { OptionsValuesService } from 'src/modules/options-values/options-values.service';

@Controller('options-values/sync')
export class OptionsValuesSyncController {
  constructor(private optionsService: OptionsValuesService) {}

  @Post()
  async sync(@Body() createOptionSyncDto: CreateOptionValueSyncDto) {
    return this.optionsService.create(createOptionSyncDto);
  }

  @Post('bulk')
  async syncBulk(
    @Res() res: Response,
    @Body(IsArrayPipe)
    createOptionSyncDto: CreateOptionValueSyncDto[],
  ) {
    const { valFailures, valSuccess } = await validateBulkDto<CreateOptionValueSyncDto>(
      createOptionSyncDto,
      CreateOptionValueSyncDto,
    );
    const { successes, failures } = await this.optionsService.createBulk(valSuccess);

    const result = {
      successes,
      failures: [...valFailures, ...failures],
    };

    const status = getBulkStatus({ failures: result.failures.length, success: result.successes.length });

    res.status(status).json(result);
  }
}

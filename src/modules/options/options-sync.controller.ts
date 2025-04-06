import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { IsArrayPipe } from 'src/common/pipes/isArray.pipe';
import { validateBulkDto } from 'src/helpers/validation/validate-bulk-dto';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';
import { OptionsService } from 'src/modules/options/options.service';
import { CreateOptionSyncDto } from 'src/modules/options/dto/create-option.dto';

@Controller('options/sync')
export class OptionsSyncController {
  constructor(private optionsService: OptionsService) {}

  @Post()
  async sync(@Body() createOptionSyncDto: CreateOptionSyncDto) {
    return this.optionsService.create(createOptionSyncDto);
  }

  @Post('bulk')
  async syncBulk(
    @Res() res: Response,
    @Body(IsArrayPipe)
    createOptionSyncDto: CreateOptionSyncDto[],
  ) {
    const { valFailures, valSuccess } = await validateBulkDto<CreateOptionSyncDto>(
      createOptionSyncDto,
      CreateOptionSyncDto,
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

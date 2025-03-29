import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser, CurrentUserData } from 'src/common/decorators/current-user.decorator';
import { IsArrayPipe } from 'src/common/pipes/isArray.pipe';
import { validateBulkDto } from 'src/helpers/validation/validate-bulk-dto';
import { ClientsService } from './clients.service';
import { CreateClientSyncDto } from './dto/create-client.dto';
import { getBulkStatus } from 'src/common/utils/bulk-status.util';

@Controller('clients/sync')
export class ClientsSyncController {
  constructor(private clientsService: ClientsService) {}

  @Post()
  async sync(@CurrentUser() user: CurrentUserData, @Body() createClientDto: CreateClientSyncDto) {
    return this.clientsService.create(createClientDto, user);
  }

  @Post('bulk')
  async syncBulk(
    @CurrentUser() user: CurrentUserData,
    @Res() res: Response,
    @Body(new IsArrayPipe())
    createClientDto: CreateClientSyncDto[],
  ) {
    const { valFailures, valSuccess } = await validateBulkDto<CreateClientSyncDto>(
      createClientDto,
      CreateClientSyncDto,
    );
    const { successes, failures } = await this.clientsService.createBulk(valSuccess, user);

    const result = {
      successes,
      failures: [...valFailures, ...failures],
    };

    const status = getBulkStatus({ failures: result.failures.length, success: result.successes.length });

    res.status(status).json(result);
  }
}

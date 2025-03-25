import { Body, Controller, ParseArrayPipe, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CurrentUser, CurrentUserData } from 'src/common/decorators/current-user.decorator';
import { validateBulkDto } from 'src/helpers/validation/validate-bulk-dto';
import { ClientsService } from './clients.service';
import { CreateClientSyncDto } from './dto/create-client.dto';
@Controller('clients-sync')
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
    @Body(new ParseArrayPipe())
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

    if (result.failures.length > 0 && successes.length > 0) {
      res.status(207).json(result);
    } else if (failures.length > 0) {
      res.status(400).json(result);
    } else {
      res.status(200).json(result);
    }
  }
}

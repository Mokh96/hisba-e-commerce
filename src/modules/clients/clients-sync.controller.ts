import { Controller, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients-sync')
export class ClientsSyncController {
  constructor(private clientsService: ClientsService) {}

  @Post()
  async sync() {
    return 'sync';
  }

  @Post('bulk')
  async syncBulk() {
    return 'sync bulk';
  }
}

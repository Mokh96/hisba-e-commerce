import { Controller, Post, Body } from '@nestjs/common';
import { SystemDataService } from './system-data.service';

@Controller('system-data')
export class SystemDataController {
  constructor(private readonly systemDataService: SystemDataService) {}

  @Post()
  create() {
    return this.systemDataService.create();
  }
}

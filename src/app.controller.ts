import { Controller, Get } from '@nestjs/common';
import { AppService } from '@app/app.service';

@Controller('/system')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  getPing(): string {
    return this.appService.getPing();
  }

  @Get('/time')
  getTime(): number {
    return Date.now();
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { HelperService } from './helper.service';

@Controller('helper')
export class HelperController {
  constructor(private readonly helperService: HelperService) {}

  @Get('get_issuer')
  async get_issuer(@Query('issuer') issuer_s) {
    return await this.helperService.get_issuer(issuer_s);
  }
}

import {
  Controller,
  Post,
  Query,
} from '@nestjs/common';
import { FlowsService } from './flows.service';

@Controller('flows')
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

  @Post('cc')
  async post(
    @Query('issuer') issuer_s: string,
    @Query('clientId') clientId: string,
    @Query('clientSecret') clientSecret: string,
  ) {
    return await this.flowsService.clientCredentials(
      issuer_s,
      clientId,
      clientSecret,
    );
  }
}

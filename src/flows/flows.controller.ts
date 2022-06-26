//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>

import { Controller, Get, Post, Body, Render } from '@nestjs/common';
import { ClientCredentialFlowInputDto } from './Dto/clientCredentialFlowInput.dto';
import { FlowsService } from './flows.service';

@Controller('flows')
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

  @Get('cc')
  @Render('cc')
  async get() {
    return;
  }

  @Post('cc')
  @Render('cc')
  async post(
    @Body() clientCredentialFlowInputDto: ClientCredentialFlowInputDto,
  ) {
    const result = await this.flowsService
      .clientCredentials(
        clientCredentialFlowInputDto.issuerUrl,
        clientCredentialFlowInputDto.clientId,
        clientCredentialFlowInputDto.clientSecret,
      )
      .then((result) => {
        return {
          showResults: result.success,
          message: result.message,

          payload: result.payload,
          header: result.header,
        };
      });

    return result;
  }
}

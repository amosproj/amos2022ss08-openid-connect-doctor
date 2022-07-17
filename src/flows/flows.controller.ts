//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>

import { Controller, Get, Post, Query, Body, Render } from '@nestjs/common';
import { ClientCredentialFlowInputDto } from './Dto/clientCredentialFlowInput.dto';
import { PasswordGrantFlowInputDto } from './Dto/passwordGrantFlowInput.dto';
import { FlowsService } from './flows.service';

@Controller('flows')
export class FlowsController {
  dicoveryContent: string;

  constructor(private readonly flowsService: FlowsService) {}

  @Get('index')
  @Render('flows')
  async index(@Query('issuer_s') issuer_s: string) {
    const result = await this.flowsService.getAllowedGrantTypes(issuer_s);

    return {
      issuer_s: issuer_s,
      allowClientCredentials: result.allowClientCredentials,
      allowPasswordGrant: result.allowPasswordGrant,
      allowAuthorizationCode: result.allowAuthorizationCode,
    };
  }

  @Get('cc')
  @Render('cc')
  async get(@Query('issuer_s') issuer_s: string) {
    return {
      issuer_s: issuer_s,
    };
  }

  @Post('cc')
  @Render('cc-result')
  async post(
    @Body() clientCredentialFlowInputDto: ClientCredentialFlowInputDto,
  ) {
    const result = await this.flowsService
      .clientCredentials(
        clientCredentialFlowInputDto.issuerUrl,
        clientCredentialFlowInputDto.clientId,
        clientCredentialFlowInputDto.clientSecret,
        clientCredentialFlowInputDto.audience,
      )
      .then(([discoveryResult, decodingResult]) => {
        return {
          showResults: decodingResult.success,
          message: decodingResult.message,

          discoveryResult: discoveryResult,
          payload: decodingResult.payload,
          header: decodingResult.header,
        };
      })
      .catch((error) => {
        return {
          showResults: false,
          message: error,

          discoveryResult: '',
          payload: '',
          header: '',
        };
      });

    return result;
  }

  @Get('pg')
  @Render('password_grant')
  async getPg(@Query('issuer_s') issuer_s: string) {
    return {
      issuer_s: issuer_s,
    };
  }

  @Post('pg')
  @Render('cc-result')
  async postPg(@Body() passwordGrantFlowInputDto: PasswordGrantFlowInputDto) {
    console.log(passwordGrantFlowInputDto);
    const result = await this.flowsService
      .passwordGrant(
        passwordGrantFlowInputDto.issuerUrl,
        passwordGrantFlowInputDto.clientId,
        passwordGrantFlowInputDto.clientSecret,
        passwordGrantFlowInputDto.username,
        passwordGrantFlowInputDto.password,
      )
      .then(([discoveryResult, decodingResult]) => {
        return {
          showResults: decodingResult.success,
          message: decodingResult.message,

          discoveryResult: discoveryResult,
          payload: decodingResult.payload,
          header: decodingResult.header,
        };
      })
      .catch((error) => {
        return {
          showResults: false,
          message: error,

          discoveryResult: '',
          payload: '',
          header: '',
        };
      });
    return result;
  }
}

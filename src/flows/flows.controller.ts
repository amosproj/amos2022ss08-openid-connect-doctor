//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>

import { Controller, Get, Post, Body, Render, Query } from '@nestjs/common';
import { ClientCredentialFlowInputDto } from './Dto/clientCredentialFlowInput.dto';
import { PasswordGrantFlowInputDto } from './Dto/passwordGrantFlowInput.dto';
import { FlowsService } from './flows.service';
import { AuthInputDto } from './Dto/authInput.dto';

@Controller('flows')
export class FlowsController {
  constructor(private readonly flowsService: FlowsService) {}

  @Get('cc')
  @Render('cc')
  async get() {
    return;
  }

  @Get('auth')
  @Render('authorization-flow')
  async getAuth() {
    return;
  }

  @Post('callback')
  @Render('cc-result')
  async authCallback(@Body() authInputDto: AuthInputDto) {
    let result;
      try{
      const [discoveryResult, decodingResult] = await this.flowsService
        .authorizationFlow(
          process.env.ISSUER_STRING,
          authInputDto.clientId,
          authInputDto.clientSecret,
          authInputDto.url,
          authInputDto.redirectUri,
        )
        console.log(discoveryResult);
        console.log(decodingResult);
        result = {
            showResults: decodingResult.success,
            message: decodingResult.message,

            discoveryResult: discoveryResult,
            payload: decodingResult.payload,
            header: decodingResult.header,
          };
        }catch(error) {
          result = {
            showResults: false,
            message: error,

            discoveryResult: '',
            payload: '',
            header: '',
          }; }
    return result;
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
  async getPg() {
    return;
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
    }

  @Post('authorize')
  @Render('cc-result')
  async postAuth(@Body() authInputDto: AuthInputDto) {
    const result = await this.flowsService
      .authorizationFlow(
        process.env.ISSUER_STRING,
        authInputDto.clientId,
        authInputDto.clientSecret,
        authInputDto.url,
        authInputDto.redirectUri,
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

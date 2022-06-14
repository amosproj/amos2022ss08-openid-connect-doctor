//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

import {
  Controller,
  Get,
  Render,
  Query,
  HttpException,
  HttpStatus,
  Res,
  Post,
  Body,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenDto } from './token.dto';
import { TokenResultDto } from './tokenResult.dto';
import { Response } from 'express';
import { GrantBody } from 'openid-client';

@Controller('token')
export default class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('decode')
  @Render('decode')
  async get() {
    return {
      message: 'Please enter the wanted information!',
      showResults: false,
    };
  }

  @Post('decode')
  @Render('decode')
  async post(@Body() tokenDto: TokenDto) {
    const result = await this.tokenService
      .decodeToken(
        tokenDto.issuer,
        tokenDto.token,
        tokenDto.getKeysFromProvider,
        tokenDto.keyMaterialAlgorithm,
        tokenDto.keyMaterialFilepath,
      )
      .then((result) => {
        return new TokenResultDto({
          success: true,
          message: 'Decoding successful',
          payload: result[0],
          header: result[1],
        });
      })
      .catch((err) => {
        return new TokenResultDto({
          success: false,
          message: err.message,
        });
      });

    return {
      showResults: result.success,
      message: result.message,

      payload: result.payload,
      header: result.header,
    };
  }

  @Get('gettoken')
  async requestToken(
    @Query('issuer')
    issuer_s: string,
    @Res()
    res: Response,
  ): Promise<any> {
    const result = await this.tokenService.requestToken(issuer_s);
    res.json(result.data).send();
  }

  @Post('gettoken')
  async requestTokenWithClientInformation(
    @Query('issuer')
    issuer_s: string,
    @Body()
    grantBody: GrantBody,
    @Res()
    res: Response,
  ): Promise<any> {
    const issuer = await this.tokenService.getIssuer(issuer_s).catch(() => {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'invalid issuer',
        },
        HttpStatus.BAD_REQUEST,
      );
    });
    const result = await this.tokenService.getToken(
      String(issuer.token_endpoint),
      grantBody,
    );
    res.json(result.data).send();
  }
}

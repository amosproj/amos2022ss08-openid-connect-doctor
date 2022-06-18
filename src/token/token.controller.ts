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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenService } from './token.service';
import { TokenDto } from './token.dto';
import { TokenResultDto } from './tokenResult.dto';
import { GrantBody } from 'openid-client';
import { join } from 'path';
import { Express, Response } from 'express';
import { createReadStream, promises as fs } from 'fs';

@Controller('token')
export default class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('decode')
  @Render('decode')
  async get(@Query('schema') schema_s: string) {
    let empty_schemas;
    if (schema_s === undefined) {
      empty_schemas = [''];
    } else {
      empty_schemas = [schema_s, ''];
    }
    const uploaded_schemas = await fs.readdir('schema/token');
    const schemas = empty_schemas.concat(uploaded_schemas.filter((x) => { return x !== schema_s; }));
    return {
      message: 'Please enter the wanted information!',
      showResults: false,
      schemas: schemas,
    };
  }

  @Post('decode')
  @Render('decode')
  @UseInterceptors(FileInterceptor('schema_file'))
  async post(@Body() tokenDto: TokenDto, @UploadedFile() schema_file: Express.Multer.File) {
    const schema_s = tokenDto.schema;
    let empty_schemas;
    if (schema_s === undefined) {
      empty_schemas = [''];
    } else {
      empty_schemas = [schema_s, ''];
    }
    const uploaded_schemas = await fs.readdir('schema/token');
    const schemas = empty_schemas.concat(uploaded_schemas.filter((x) => { return x !== schema_s; }));

    if (schema_file && schema_s !== '') {
      return {
        showResults: false,
        message: "Please choose only one schema for validation",

        payload: null,
        header: null,
        schemas: schemas,
      };
    }

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

    if (result.success && (schema_s !== '' || schema_file)) {
      // color the payload according to schema if decoding succeeded
      let schema_body;
      if (schema_file) {
        schema_body = JSON.parse(schema_file.buffer.toString());
      } else {
        schema_body = require(join('..', '..', 'schema', 'token', schema_s));
      }
      const [success, colored_payload] =
        await this.tokenService.coloredFilteredValidation(
          JSON.parse(result.payload),
          schema_body,
      );
      let message = result.message;
      if (success === 0) {
        message = "Decoding was successful, but schema did not match";
      }
      return {
        showResults: result.success,
        message: message,

        payload: colored_payload,
        header: result.header,
        schemas: schemas,
      };
    }
    else {
      return {
        showResults: result.success,
        message: result.message,

        payload: result.payload,
        header: result.header,
        schemas: schemas,
      };
    }
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

  @Post('/schema/upload')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadSchema(@UploadedFile() file: Express.Multer.File, @Res() res) {
    if (file == null) {
        res.status(302).redirect('/api/token/decode');
        return;
    }
    await fs.writeFile(join(process.cwd(), 'schema/token', file.originalname), file.buffer);
    res.status(302).redirect('/api/token/decode');
  }

  @Get('/schema/download')
  downloadSchema(@Query('schema') schema_s: string, @Res() res: Response) {
    if (schema_s === '') {
        res.status(302).redirect('/api/token/decode');
        return;
    }
    const file = createReadStream(join(process.cwd(), 'schema/token', schema_s));
    file.pipe(res);
  }

  @Get('/schema/delete')
  async deleteSchema(@Query('schema') schema_s: string, @Res() res: Response) {
    if (schema_s === '') {
        res.status(302).redirect('/api/token/decode');
        return;
    }
    await fs.unlink(join(process.cwd(), 'schema/token', schema_s));
    res.status(302).redirect('/api/token/decode');
  }
}

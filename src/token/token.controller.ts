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
  async post(@Body() tokenDto: TokenDto) {
    let empty_schemas;
    const schema_s = tokenDto.schema;
    if (schema_s === undefined) {
      empty_schemas = [''];
    } else {
      empty_schemas = [schema_s, ''];
    }
    const uploaded_schemas = await fs.readdir('schema/token');
    const schemas = empty_schemas.concat(uploaded_schemas.filter((x) => { return x !== schema_s; }));
    const result = await this.tokenService
      .decodeToken(
        tokenDto.issuer,
        tokenDto.keyMaterialEndpoint,
        tokenDto.token,
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

    if (result.success) {
      // color the payload according to schema if decoding succeeded
      const [success, colored_payload] =
        await this.tokenService.coloredFilteredValidation(
          JSON.parse(result.payload),
          schema_s,
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
    await fs.writeFile(join(process.cwd(), 'schema/token', file.originalname), file.buffer);
    res.status(302).redirect('/api/token/decode');
  }

  @Get('/schema/download')
  downloadSchema(@Query('schema') schema_s: string, @Res() res: Response) {
    const file = createReadStream(join(process.cwd(), 'schema/token', schema_s));
    file.pipe(res);
  }

  @Get('/schema/delete')
  async deleteSchema(@Query('schema') schema_s: string, @Res() res: Response) {
    await fs.unlink(join(process.cwd(), 'schema/token', schema_s));
    res.status(302).redirect('/api/token/decode');
  }
}

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

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  async get(@Query('issuer') issuer: string, @Body() tokenDto: TokenDto) {
    return {
      result: await this.tokenService
        .decodeToken(issuer, tokenDto.keyMaterialEndpoint, tokenDto.tokenString)
        .then((result) => {
          return new TokenResultDto({
              payload: result[0],
              header: result[1],
            });
        })
        .catch((err) => {
          return err;
        }),
    };
  }
}

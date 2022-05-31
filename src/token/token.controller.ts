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

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  async get(@Query('issuer') issuer: string, @Body() tokenDto: TokenDto) {
    return {
      result: await this.tokenService
        .decodeToken(issuer, tokenDto.keyMaterialEndpoint, tokenDto.tokenString)
        .then((sub) => {
          console.log(sub);
          return 'Token decoded for sub: ' + sub;
        })
        .catch((err) => {
          return err;
        }),
    };
  }
}

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

    return {
      showResults: result.success,
      message: result.message,

      payload: result.payload,
      header: result.header,
    };
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GrantBody, Issuer } from 'openid-client';
import axios from 'axios';
import * as qs from 'qs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

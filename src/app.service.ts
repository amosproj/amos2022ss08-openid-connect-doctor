import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GrantBody, Issuer } from 'openid-client';
import axios from 'axios';
import * as qs from 'qs';

import Ajv, {JSONSchemaType} from "ajv"

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getToken(token_endpoint: string, grantBody: GrantBody): Promise<any> {
    return await axios
      .post(token_endpoint, qs.stringify(grantBody), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .catch(() => {
        throw new HttpException(
          {
            status: HttpStatus.UNAUTHORIZED,
            error: 'Access denied',
          },
          HttpStatus.UNAUTHORIZED,
        );
      });
  }

  async requestToken(issuer: Issuer): Promise<any> {
    const grantBody: GrantBody = {
      grant_type: process.env.CLIENT_CREDENTIALS_STRING,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: process.env.AUDIENCE,
    };

    return await this.getToken(String(issuer.token_endpoint), grantBody);
  }

  async validateJson(json: string, schema_file_path: string) {
    const ajv = new Ajv();
    console.log(require(schema_file_path));
    const validate = ajv.compile(require(schema_file_path));
    console.log(validate(42));
    console.log(validate(json));
  }
}

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

  async validateJson(issuer: object, schema_file: string) {
    const ajv = new Ajv();
    const schema_file_path = '../schema/' + schema_file;
    const validate = ajv.compile(require(schema_file_path));
    return [validate(issuer), validate.errors];
  }

  colorFilterJSON(required) {
    return function(key, value) {
      console.log('stringify key');
      console.log(key);
      if (key === '') {
        return value;
      }
      if (required.includes(key)) {
        return '<span style="color:green">' + JSON.stringify(value) + '</span>';
      } else {
        return JSON.stringify(value, null, 2);
      }
    };
  }

  myStringify(issuer, required, keys) {
    let res = '{\n';
    let first = true;
    for (const key in issuer) {
      if (keys.includes(key)) {
        if (!first) {
          res = res + ',\n';
        }
        if (required.includes(key)) {
          res = res + `"${key}": ` + '<span style="color:green">' + JSON.stringify(issuer[key]) + '</span>';
        } else {
          res = res + `"${key}": ` + JSON.stringify(issuer[key], null, 2);
        }
        first = false;
      }
    }
    res = res + '\n}';
    return res;
  }

  async coloredFilteredValidation(issuer: object, schema_file: string, keys: any[]) {
    const [ valid, errors ] = await this.validateJson(issuer, schema_file);
    console.log('start validation');
    if (valid) {
      const schema = require('../schema/' + schema_file);
      const required = schema.required;
      const replacer = this.colorFilterJSON(required);
      console.log('start stringify');
      return this.myStringify(issuer, required, keys);
    } else {
      return errors;
    }
  }
}

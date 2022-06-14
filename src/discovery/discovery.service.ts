import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Issuer} from "openid-client";
import Ajv, {JSONSchemaType} from "ajv"
import { join } from 'path';

@Injectable()
export class DiscoveryService {

    async get_issuer(issuer_s) {
        if(issuer_s === undefined || issuer_s === ''){
            throw new HttpException(
                'There was no issuer string passed to get the issuer',
                HttpStatus.BAD_REQUEST,
            );
        }
        const issuer = await Issuer.discover(issuer_s);
        return issuer;
    }
  async validateJson(issuer: object, schema_file: string) {
    const ajv = new Ajv();
    const schema_file_path = '../../schema/' + schema_file;
    const validate = ajv.compile(require(schema_file_path));
    return [validate(issuer), validate.errors];
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
                  res = res + `  "${key}": ` + '<span style="color:green">' + JSON.stringify(issuer[key]) + '</span>';
              } else {
                  res = res + `  "${key}": ` + JSON.stringify(issuer[key], null, 2);
              }
              first = false;
          }
      }
      res = res + '\n}';
      return res;
  }

  async coloredFilteredValidation(issuer: object, schema_file: string, keys: any[]) {
      const [ valid, errors ] = await this.validateJson(issuer, schema_file);
      if (valid) {
          const schema = require(join('..', '..', 'schema', schema_file));
          const required = schema.required;
          return [1, this.myStringify(issuer, required, keys)];
      } else {
          return [0, JSON.stringify(errors, null, 2)];
      }
  }
}

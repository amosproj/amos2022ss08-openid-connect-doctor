//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>
//SDPX-FileCopyrightText: 2022 Sarah Julia Kriesch <sarah.j.kriesch@fau.de>

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as jose from 'jose';
import { GrantBody } from 'openid-client';
import axios from 'axios';
import * as qs from 'qs';
import { DiscoveryService } from '../discovery/discovery.service';
import * as fs from 'fs';
import { GetKeyFunction } from 'jose/dist/types/types';
import { SettingsService } from '../settings/settings.service';
import { HelperService } from '../helper/helper.service';

@Injectable()
export class TokenService {
  @Inject(HelperService)
  private readonly helperService: HelperService;
  @Inject(SettingsService)
  private readonly settingsService: SettingsService;
  @Inject(DiscoveryService)
  private readonly discoveryService: DiscoveryService;

  async getSchemas(schema_s: string) {
    return this.helperService.getSchemasHelper(schema_s, 'token');
  }

  async getIssuer(issuer_s: string) {
    if (issuer_s === undefined || issuer_s === '') {
      throw new HttpException(
        'There was no issuer string passed to get the issuer',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.helperService.get_issuer(issuer_s);
  }

  async getToken(token_endpoint: string, grantBody: GrantBody): Promise<any> {
    if (token_endpoint === undefined || token_endpoint === '') {
      throw new HttpException(
        'No or Empty token endpoint has been received',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (grantBody.grant_type === undefined || grantBody.grant_type === '') {
      throw new HttpException(
        'No or Empty grant_type has been received',
        HttpStatus.BAD_REQUEST,
      );
    }
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

  async requestToken(issuer_s: string): Promise<any> {
    if (issuer_s === undefined || issuer_s === '') {
      throw new HttpException(
        'There was no issuer string passed to get the issuer',
        HttpStatus.BAD_REQUEST,
      );
    }

    const issuer = await this.getIssuer(issuer_s).catch(() => {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'invalid issuer',
        },
        HttpStatus.BAD_REQUEST,
      );
    });

    const grantBody: GrantBody = {
      grant_type: process.env.CLIENT_CREDENTIALS_STRING,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: process.env.AUDIENCE,
    };

    return await this.getToken(String(issuer.token_endpoint), grantBody);
  }

  async decodeToken(tokenString: string): Promise<[string, string, string]> {
    const [header, payload, signature] = this.decodeTokenString(tokenString);

    const formattedHeader = JSON.stringify(header, undefined, 2);
    const formattedPayload = JSON.stringify(payload, undefined, 2);
    const formattedSignature = JSON.stringify(signature, undefined, 2);

    return [formattedHeader, formattedPayload, formattedSignature];
  }

  async validateTokenSignature(
    issuerUrl: string,
    tokenString: string,
    getKeysFromProvider: boolean,
    algorithm: string,
    filepath: string,
  ): Promise<[boolean, string]> {
    if (getKeysFromProvider) {
      return await this.validateTokenStringWithExternalKeys(
        tokenString,
        issuerUrl,
      );
    } else {
      return await this.validateTokenStringWithFileKeys(
        tokenString,
        algorithm,
        filepath,
        issuerUrl,
      );
    }
  }

  async coloredFilteredValidation(issuer: object, schema: object) {
    const keys = [];
    for (const key in issuer) {
      keys.push(key);
    }
    return this.helperService.coloredFilteredValidationWithFileContent(
      issuer,
      schema,
      keys,
    );
  }

  private decodeTokenString(tokenString: string): [string, string, string] {
    if (tokenString === undefined || tokenString === '') {
      throw new HttpException('There was no token to decode!', 400);
    }

    const tokenParts = tokenString.split('.');

    if (tokenParts.length !== 3) {
      throw new HttpException('The token-string is incomplete!', 400);
    }

    const header = this.decodeBase64EncodedString(tokenParts[0]);
    const body = this.decodeBase64EncodedString(tokenParts[1]);
    const signatures = this.decodeBase64EncodedStringKey(tokenParts[2]);


    return [header, body, signatures];
  }

  private decodeBase64EncodedString(input: string): string {
    return JSON.parse(new TextDecoder().decode(jose.base64url.decode(input)));
  }

  private async decodeBase64EncodedStringKey(input: string): Promise <string> { 
    return await jose.JWK.asKey(new TextDecoder().decode(jose.base64url.decode(input)));
  }

  private async validateTokenStringWithExternalKeys(
    tokenString: string,
    issuer: string,
  ): Promise<[boolean, string]> {
    let isValid = true;
    let message = '';

    try {
      const keyMaterial = await this.getExternalKeyMaterial(issuer);

      const { payload, protectedHeader } = await jose.jwtVerify(
        tokenString,
        keyMaterial,
        {
          issuer: issuer,
        },
      );

      if (payload !== undefined && protectedHeader !== undefined) {
        message = 'The token-signature is valid!';
      } else {
        isValid = false;
        message = 'Validation was not possible';
      }
    } catch (error) {
      isValid = false;
      message = `The validation failed: ${error}`;
    }

    return [isValid, message];
  }

  private async getExternalKeyMaterial(
    issuerUrl: string,
  ): Promise<
    GetKeyFunction<jose.JoseHeaderParameters, jose.FlattenedJWSInput>
  > {
    const discoveryInformation = await this.discoveryService.get_issuer(
      issuerUrl,
    );
    const keyMaterialEndpoint = String(discoveryInformation['jwks_uri']);

    const keys = jose.createRemoteJWKSet(new URL(keyMaterialEndpoint));
    return keys;
  }

  private async validateTokenStringWithFileKeys(
    tokenString: string,
    algorithm: string,
    filepath: string,
    issuer: string,
  ): Promise<[boolean, string]> {
    let isValid = true;
    let message = '';

    try {
      const keyMaterial = await this.getFileKeyMaterial(algorithm, filepath);

      const { payload, protectedHeader } = await jose.jwtVerify(
        tokenString,
        keyMaterial,
        {
          issuer: issuer,
        },
      );

      if (payload !== undefined && protectedHeader !== undefined) {
        message = 'The token-signature is valid!';
      } else {
        isValid = false;
        message = 'Validation was not possible';
      }
    } catch (error) {
      isValid = false;
      message = `The validation failed: ${error}`;
    }

    return [isValid, message];
  }

  private async getFileKeyMaterial(
    algorithm: string,
    filepath: string,
  ): Promise<jose.KeyLike> {
    const data = fs.readFileSync(filepath, 'utf8');

    const keys = await jose.importSPKI(data, algorithm);
    return keys;
  }

  getKeyAlgorithms() {
    const all_schemas = [
      '',
      'EdDSA',
      'ES256',
      'ES256K',
      'ES384',
      'ES512',
      'HS256',
      'HS384',
      'HS512',
      'PS256',
      'PS384',
      'PS512',
      'RS256',
      'RS384',
      'RS512',
    ];
    const default_algo = this.settingsService.config.token.key_algorithm;
    const default_list = [default_algo];
    return default_list.concat(
      all_schemas.filter((x) => {
        return x !== default_algo;
      }),
    );
  }
}

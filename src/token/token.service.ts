//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as jose from 'jose';
import { GrantBody } from 'openid-client';
import axios from 'axios';
import * as qs from 'qs';
import { DiscoveryService } from '../discovery/discovery.service';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class TokenService {
  @Inject(DiscoveryService)
  private readonly discoveryService: DiscoveryService;

  async getIssuer(issuer_s: string) {
    if (issuer_s === undefined || issuer_s === '') {
      throw new HttpException(
        'There was no issuer string passed to get the issuer',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.discoveryService.get_issuer(issuer_s);
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

  async decodeToken(
    issuer: string,
    tokenString: string,
    getKeysFromProvider: boolean,
    keyMaterialAlgorithm: string,
    keyMaterialFilepath: string,
  ): Promise<[string, string]> {
    if (getKeysFromProvider) {
      const resultWithExternalMaterial =
        await this.decodeTokenWithExternalKeyMaterial(issuer, tokenString);

      return resultWithExternalMaterial;
    } else {
      const results = await this.decodeTokenWithKeyMaterialFile(
        issuer,
        tokenString,
        keyMaterialAlgorithm,
        keyMaterialFilepath,
      );

      return results;
    }
  }

  private async decodeTokenWithExternalKeyMaterial(
    issuer: string,
    token: string,
  ): Promise<[string, string]> {
    if (issuer === undefined || issuer === '') {
      throw new HttpException(
        'There was no issuer to validate the token against!',
        400,
      );
    }

    if (token === undefined || token === '') {
      throw new HttpException('There was no tokenString to decode!', 400);
    }

    const discoveryInformation = await this.discoveryService.get_issuer(issuer);
    const keyMaterialEndpoint = String(discoveryInformation['jwks_uri']);

    const key_material = jose.createRemoteJWKSet(new URL(keyMaterialEndpoint));

    const { payload, protectedHeader } = await jose.jwtVerify(
      token,
      key_material,
      {
        issuer: issuer,
      },
    );

    return [
      JSON.stringify(payload, undefined, 2),
      JSON.stringify(protectedHeader, undefined, 2),
    ];
  }

  async coloredFilteredValidation(issuer: object, schema: object) {
    let keys = [];
    for (const key in issuer) {
      keys.push(key);
    }
    return this.discoveryService.coloredFilteredValidationWithFileContent(issuer, schema, keys);
  }

  private async decodeTokenWithKeyMaterialFile(
    issuer: string,
    token: string,
    algorithm: string,
    filepath: string,
  ): Promise<[string, string]> {
    if (issuer === undefined || issuer === '') {
      throw new HttpException(
        'There was no issuer to validate the token against!',
        400,
      );
    }

    if (token === undefined || token === '') {
      throw new HttpException('There was no tokenString to decode!', 400);
    }

    if (algorithm === undefined || algorithm === '') {
      throw new HttpException('Missing algorithm!', 400);
    }

    if (filepath === undefined || filepath === '') {
      throw new HttpException('Invalid filepath!', 400);
    }

    if (!filepath.endsWith('.pem')) {
      throw new HttpException(
        'Unsupported file-type (Supported formats: .pem)',
        400,
      );
    }

    let payloadString = '';
    let protectedHeaderString = '';
    const data = fs.readFileSync(filepath, 'utf8');

    const key_material = await jose.importSPKI(data, algorithm);

    const { payload, protectedHeader } = await jose.jwtVerify(
      token,
      key_material,
      {
        issuer: issuer,
        algorithms: [algorithm]
      },
    );

    payloadString = JSON.stringify(payload, undefined, 2);
    protectedHeaderString = JSON.stringify(protectedHeader, undefined, 2);

    return [payloadString, protectedHeaderString];
  }
}

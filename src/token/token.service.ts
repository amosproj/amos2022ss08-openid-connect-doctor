import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as jose from 'jose';
import { GrantBody, Issuer } from 'openid-client';
import axios from 'axios';
import * as qs from 'qs';
import { DiscoveryService } from '../discovery/discovery.service';
import { join } from 'path';

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
    keyMaterialEndpoint: string,
    tokenString: string,
  ): Promise<[string, string]> {
    if (issuer === undefined || issuer === '') {
      throw new HttpException(
        'There was no issuer to validate the token against!',
        400,
      );
    }

    if (keyMaterialEndpoint === undefined || keyMaterialEndpoint === '') {
      throw new HttpException(
        'There was no keyMaterialEndpoint to validate the token against!',
        400,
      );
    }

    if (tokenString === undefined || tokenString === '') {
      throw new HttpException('There was no tokenString to decode!', 400);
    }

    const key_material = jose.createRemoteJWKSet(new URL(keyMaterialEndpoint));

    const { payload, protectedHeader } = await jose.jwtVerify(
      tokenString,
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
}

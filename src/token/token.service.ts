import { HttpException, Injectable } from '@nestjs/common';
import * as jose from 'jose';

@Injectable()
export class TokenService {
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

    return [JSON.stringify(payload), JSON.stringify(protectedHeader)];
  }
}

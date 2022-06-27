//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { DiscoveryService } from '../discovery/discovery.service';
import { ClientCredentialFlowResultDto } from './Dto/clientCredentialFlowResult.dto';

@Injectable()
export class FlowsService {
  @Inject(TokenService)
  private readonly tokenService: TokenService;

  @Inject(DiscoveryService)
  private readonly discoveryService: DiscoveryService;

  async clientCredentials(
    issuer_s: string,
    clientId: string,
    clientSecret: string,
    audience: string,
  ): Promise<[string, ClientCredentialFlowResultDto]> {
    if (issuer_s === undefined || issuer_s === '') {
      throw new HttpException(
        'There was no issuer to validate the token against!',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (clientId === undefined || clientId === '') {
      throw new HttpException(
        'There was no client id provided',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (clientSecret === undefined || clientSecret === '') {
      throw new HttpException(
        'There was no client secret provided',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (audience === undefined || audience === '') {
      audience = clientId;
    }

    let discoveryResult = '';
    let receivedTokenString = '';

    try {
      const issuer = await this.discoveryService.get_issuer(issuer_s);
      const receivedToken = await this.tokenService.getToken(
        String(issuer.token_endpoint),
        {
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
          audience: audience,
        },
      );

      discoveryResult = JSON.stringify(issuer, undefined, 2);
      receivedTokenString = String(receivedToken.data.access_token);
    } catch (error) {
      return [
        '',
        new ClientCredentialFlowResultDto({
          success: false,
          message: `An error occurred ${error}`,
          payload: undefined,
          header: undefined,
        }),
      ];
    }

    const result = await this.tokenService
      .decodeToken(receivedTokenString)
      .then(async ([header, payload]) => {
        const validationResult = await this.tokenService
          .validateTokenSignature(issuer_s, receivedTokenString, true, '', '')
          .then(([isValid, message]) => {
            if (isValid) {
              return new ClientCredentialFlowResultDto({
                success: true,
                message: 'Request and validation successful',
                payload: payload,
                header: header,
              });
            } else {
              return new ClientCredentialFlowResultDto({
                success: true,
                message: `Request successful, but validation failed: ${message}`,
                payload: payload,
                header: header,
              });
            }
          });

        return validationResult;
      })
      .catch(
        (error) =>
          new ClientCredentialFlowResultDto({
            success: true,
            message: `An error occurred ${error}`,
            payload: undefined,
            header: undefined,
          }),
      );

    return [discoveryResult, result];
  }
}

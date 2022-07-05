//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { DiscoveryService } from '../discovery/discovery.service';
import { ExtendedProtocolService } from '../extended-protocol/extended-protocol.service';
import { ClientCredentialFlowResultDto } from './Dto/clientCredentialFlowResult.dto';
import { UtilsService } from '../utils/utils.service';

@Injectable()
export class FlowsService {
  @Inject(TokenService)
  private readonly tokenService: TokenService;
  @Inject(ExtendedProtocolService)
  private readonly protocolService: ExtendedProtocolService;

  @Inject(DiscoveryService)
  private readonly discoveryService: DiscoveryService;

  @Inject(UtilsService)
  private readonly utilsService: UtilsService;

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

    this.protocolService.extendedLog('Start retrieving client credentials');

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
      this.protocolService.extendedLogSuccess(
        'Client credentials successfully retrieved',
      );
    } catch (error) {
      this.protocolService.extendedLogError(
        'Failed to retrieve client credentials',
      );
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

    this.protocolService.extendedLog('Decode retrieved token');
    const result = await this.tokenService
      .decodeToken(receivedTokenString)
      .then(async ([header, payload]) => {
        const validationResult = await this.tokenService
          .validateTokenSignature(issuer_s, receivedTokenString, true, '', '')
          .then(async ([isValid, message]) => {
            if (isValid) {
              await this.utilsService.writeOutput(
                header + '\n' + payload + '\n' + message,
              );
              this.protocolService.extendedLogSuccess('Token decoded');
              return new ClientCredentialFlowResultDto({
                success: true,
                message: 'Request and validation successful',
                payload: payload,
                header: header,
              });
            } else {
              this.protocolService.extendedLogError('Token validation failed');
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

  async authorizationFlow(
    issuer_s: string,
    clientId: string,
    clientSecret: string,
    code: string,
    redirectURI: string,
  ) : Promise<[string, ClientCredentialFlowResultDto]> {
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

    if (code === undefined || code === '') {
      throw new HttpException(
        'There is no code provided for the authorization flow!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (redirectURI == undefined || redirectURI === '') {
      throw new HttpException(
        'There was no redirectURI provided!',
        HttpStatus.BAD_REQUEST,
      );
    }

    this.protocolService.extendedLog('Start authorization flow');

    let discoveryResult = '';
    let tokenString = '';

    try {
      const issuer = await this.discoveryService.get_issuer(issuer_s);
      const token = await this.tokenService.getToken(
        String(issuer.token_endpoint),
        {
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: redirectURI,
          audience: 'oidc-app',
        },
      );

      discoveryResult = JSON.stringify(issuer, undefined, 2);
      tokenString = String(token.data.access_token);
      this.protocolService.extendedLog(
        'Successfully retrieved access token for authorization code flow',
      );
    } catch (error) {
      this.protocolService.extendedLogError('Failed authorization code flow');
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

    this.protocolService.extendedLog('Decode retrieved token');
    const result = await this.tokenService
      .decodeToken(tokenString)
      .then(async ([header, payload]) => {
        const validationResult = await this.tokenService
          .validateTokenSignature(issuer_s, tokenString, true, '', '')
          .then(async ([isValid, message]) => {
            if (isValid) {
              await this.utilsService.writeOutput(
                header + '\n' + payload + '\n' + message,
              );
              this.protocolService.extendedLogSuccess('Token decoded');
              return new ClientCredentialFlowResultDto({
                success: true,
                message: 'Request and validation successful',
                payload: payload,
                header: header,
              });
            } else {
              this.protocolService.extendedLogError('Token validation failed');
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

//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { DiscoveryModule } from '../discovery/discovery.module';
import { FlowsModule } from '../flows/flows.module';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DiscoveryModule, FlowsModule],
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('decodeToken', () => {
    it('should fail if no issuer is provided', async () => {
      await expect(
        service.decodeToken(undefined, 'test', true, '', undefined),
      ).rejects.toThrow('There was no issuer to validate the token against!');
    });

    it('should fail if an empty issuer is provided', async () => {
      await expect(
        service.decodeToken('', 'test', true, '', undefined),
      ).rejects.toThrow('There was no issuer to validate the token against!');
    });

    it('should fail if no token-string is provided', async () => {
      await expect(
        service.decodeToken(
          'http://localhost:8080',
          undefined,
          true,
          '',
          undefined,
        ),
      ).rejects.toThrow('There was no tokenString to decode!');
    });

    it('should fail if an empty token-string is provided', async () => {
      await expect(
        service.decodeToken('http://localhost:8080', '', true, '', undefined),
      ).rejects.toThrow('There was no tokenString to decode!');
    });

    it('should fail if no filepath is provided, when using a file', async () => {
      await expect(
        service.decodeToken(
          'http://localhost:8080',
          'test',
          false,
          'RS256',
          undefined,
        ),
      ).rejects.toThrow('Invalid filepath!');
    });

    it('should fail if an empty filepath is provided, when using a file', async () => {
      await expect(
        service.decodeToken(
          'http://localhost:8080',
          'test',
          false,
          'RS256',
          '',
        ),
      ).rejects.toThrow('Invalid filepath!');
    });

    it('should fail if no algorithm is provided, when using a file', async () => {
      await expect(
        service.decodeToken(
          'http://localhost:8080',
          'test',
          false,
          undefined,
          'testfile.pem',
        ),
      ).rejects.toThrow('Missing algorithm!');
    });

    it('should fail if an empty value is provided for the algorithm, when using a file', async () => {
      await expect(
        service.decodeToken(
          'http://localhost:8080',
          'test',
          false,
          '',
          'testfile.pem',
        ),
      ).rejects.toThrow('Missing algorithm!');
    });

    it('should fail if an invalid filpath is provided, when using a file', async () => {
      await expect(
        service.decodeToken(
          'http://localhost:8080',
          'test',
          false,
          'RS256',
          'Testfile.json',
        ),
      ).rejects.toThrow('Unsupported file-type (Supported formats: .pem)');
    });
  });

  describe('getIssuer', () => {
    it('should fail if no issuer is provided', async () => {
      await expect(service.getIssuer(undefined)).rejects.toThrow(
        'There was no issuer string passed to get the issuer',
      );
    });

    it('should fail is an empty issuer is provided', async () => {
      await expect(service.getIssuer('')).rejects.toThrow(
        'There was no issuer string passed to get the issuer',
      );
    });
  });

  describe('getToken', () => {
    it('should fail if no token endpoint is provided', async () => {
      await expect(
        service.getToken(
          undefined,
          JSON.parse(
            '{"client' +
              '_id":"test-client-id","client_secret":"test-client-secret","audience":"test-audience","grant_type":"test-grant-type"}',
          ),
        ),
      ).rejects.toThrow('No or Empty token endpoint has been received');
    });

    it('should fail if empty token endpoint is provided', async () => {
      await expect(
        service.getToken(
          '',
          JSON.parse(
            '{"client' +
              '_id":"test-client-id","client_secret":"test-client-secret","audience":"test-audience","grant_type":"test-grant-type"}',
          ),
        ),
      ).rejects.toThrow('No or Empty token endpoint has been received');
    });

    it('should fail if no grant type is provided', async () => {
      await expect(
        service.getToken(
          'test-token-endpoint',
          JSON.parse(
            '{"client' +
              '_id":"test-client-id","client_secret":"test-client-secret","audience":"test-audience"}',
          ),
        ),
      ).rejects.toThrow('No or Empty grant_type has been received');
    });

    it('should fail if empty grant type is provided', async () => {
      await expect(
        service.getToken(
          'test-token-endpoint',
          JSON.parse(
            '{"client' +
              '_id":"test-client-id","client_secret":"test-client-secret","audience":"test-audience", "grant_type":""}',
          ),
        ),
      ).rejects.toThrow('No or Empty grant_type has been received');
    });
  });

  describe('requestToken', () => {
    it('should fail if no issuer is provided', async () => {
      await expect(service.requestToken(undefined)).rejects.toThrow(
        'There was no issuer string passed to get the issuer',
      );
    });

    it('should fail if empty issuer is provided', async () => {
      await expect(service.requestToken('')).rejects.toThrow(
        'There was no issuer string passed to get the issuer',
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { DiscoveryModule } from '../discovery/discovery.module';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DiscoveryModule],
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
        service.decodeToken(
          undefined,
          'http://localhost:8080/.well-known/openid-configuration/jwks',
          'test',
        ),
      ).rejects.toThrow('There was no issuer to validate the token against!');
    });

    it('should fail if an empty issuer is provided', async () => {
      await expect(
        service.decodeToken(
          '',
          'http://localhost:8080/.well-known/openid-configuration/jwks',
          'test',
        ),
      ).rejects.toThrow('There was no issuer to validate the token against!');
    });

    it('should fail if no keyMaterialEnpoint is provided', async () => {
      await expect(
        service.decodeToken('http://localhost:8080', undefined, 'test'),
      ).rejects.toThrow(
        'There was no keyMaterialEndpoint to validate the token against!',
      );
    });

    it('should fail if an empty keyMaterialEnpoint is provided', async () => {
      await expect(
        service.decodeToken('http://localhost:8080', '', 'test'),
      ).rejects.toThrow(
        'There was no keyMaterialEndpoint to validate the token against!',
      );
    });

    it('should fail if no token-string is provided', async () => {
      await expect(
        service.decodeToken(
          'http://localhost:8080',
          'http://localhost:8080/.well-known/openid-configuration/jwks',
          undefined,
        ),
      ).rejects.toThrow('There was no tokenString to decode!');
    });

    it('should fail if an empty token-string is provided', async () => {
      await expect(
        service.decodeToken(
          'http://localhost:8080',
          'http://localhost:8080/.well-known/openid-configuration/jwks',
          '',
        ),
      ).rejects.toThrow('There was no tokenString to decode!');
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

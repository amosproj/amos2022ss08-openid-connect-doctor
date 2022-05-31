import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
});

//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { DiscoveryModule } from '../discovery/discovery.module';
import { FlowsModule } from '../flows/flows.module';
import { SettingsModule } from '../settings/settings.module';
import { HelperModule } from '../helper/helper.module';
import { ExtendedProtocolModule } from '../extended-protocol/extended-protocol.module';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DiscoveryModule,
        FlowsModule,
        SettingsModule,
        HelperModule,
        ExtendedProtocolModule,
      ],
      providers: [TokenService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('decodeToken', () => {
    it('should fail if no token is provided', async () => {
      await expect(service.decodeToken(undefined)).rejects.toThrow(
        'There was no token to decode!',
      );
    });

    it('should fail if an empty issuer is provided', async () => {
      await expect(service.decodeToken('')).rejects.toThrow(
        'There was no token to decode!',
      );
    });

    it('should fail if a malformed token is provided', async () => {
      await expect(
        service.decodeToken(
          'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ0N2JhbXhmQ3JCMlRFd2VfajlFUEpBaFpBcTBGR1dVblhCTnhpSGJ1UFFFIn0.eyJleHAiOjE2NTQ0OTEzODAsImlhdCI6MTY1NDQ5MTMyMCwianRpIjoiYjM5MDA5YmYtZWVmNS00MmU5LTgzNDYtMzliNTIzMDhmMmJiIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiOWZlZGJjMjktNDIzYy00OTA3LThjNjgtYzg0M2I5OWM3NGY5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoib3BlbmlkLWRvYyIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1tYXN0ZXIiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiY2xpZW50SG9zdCI6IjE3Mi4xNy4wLjEiLCJjbGllbnRJZCI6Im9wZW5pZC1kb2MiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1vcGVuaWQtZG9jIiwiY2xpZW50QWRkcmVzcyI6IjE3Mi4xNy4wLjEifQ',
        ),
      ).rejects.toThrow('The token-string is incomplete!');
    });

    it('should return a valid token response', async () => {
      const result = await service.decodeToken(
        'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ0N2JhbXhmQ3JCMlRFd2VfajlFUEpBaFpBcTBGR1dVblhCTnhpSGJ1UFFFIn0.eyJleHAiOjE2NTQ0OTEzODAsImlhdCI6MTY1NDQ5MTMyMCwianRpIjoiYjM5MDA5YmYtZWVmNS00MmU5LTgzNDYtMzliNTIzMDhmMmJiIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiOWZlZGJjMjktNDIzYy00OTA3LThjNjgtYzg0M2I5OWM3NGY5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoib3BlbmlkLWRvYyIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1tYXN0ZXIiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiY2xpZW50SG9zdCI6IjE3Mi4xNy4wLjEiLCJjbGllbnRJZCI6Im9wZW5pZC1kb2MiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6InNlcnZpY2UtYWNjb3VudC1vcGVuaWQtZG9jIiwiY2xpZW50QWRkcmVzcyI6IjE3Mi4xNy4wLjEifQ.geGBNRzOavm0W-4fEe_ickwvienTHc88JA53Ey253p0jaZkoJRcHYwlmnEkzPiye_1x6g9ww_dOZ6DbrlDL1uHxDFlqE0YUIKLTvCCxA-CYQlt2jmt4hqVtqTai4AXNl9As8mm02W5E5WoMuxzaaJTxQD6ENhMKQazl7TeXZJx6lQfuavQZky3uXnESVpeJdq7gbXOu3LoeAjqNkUznugI8DLTTTQyHOTezZ01w45p68ijVRrPuxXYEVsPcNWDQ6eLyzJkl8-rSnUX-2G4uRmYsL5nmagUr_cb3BvqDFmDOSgyxjdMmE701xhVCXuUNUmXvsBSQOgQS3YN66vi4XXg',
      );
      expect(result[0]).toBe(
        '{\n  "alg": "RS256",\n  "typ": "JWT",\n  "kid": "t7bamxfCrB2TEwe_j9EPJAhZAq0FGWUnXBNxiHbuPQE"\n}',
      );
      expect(result[1]).toBe(
        '{\n  "exp": 1654491380,\n  "iat": 1654491320,\n  "jti": "b39009bf-eef5-42e9-8346-39b52308f2bb",\n  "iss": "http://localhost:8080/realms/master",\n  "aud": "account",\n  "sub": "9fedbc29-423c-4907-8c68-c843b99c74f9",\n  "typ": "Bearer",\n  "azp": "openid-doc",\n  "acr": "1",\n  "realm_access": {\n    "roles": [\n      "default-roles-master",\n      "offline_access",\n      "uma_authorization"\n    ]\n  },\n  "resource_access": {\n    "account": {\n      "roles": [\n        "manage-account",\n        "manage-account-links",\n        "view-profile"\n      ]\n    }\n  },\n  "scope": "profile email",\n  "clientHost": "172.17.0.1",\n  "clientId": "openid-doc",\n  "email_verified": false,\n  "preferred_username": "service-account-openid-doc",\n  "clientAddress": "172.17.0.1"\n}',
      );
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

  describe('filterToken', () => {
    it('should raise an error if the header is undefined', () => {
      const headerString = undefined;
      const payloadString = '';
      const testfilters = [];

      expect(() =>
        service.filterToken(headerString, payloadString, testfilters),
      ).toThrow('The header-string was undefined');
    });
    it('should raise an error if the payload is undefined', () => {
      const headerString = '';
      const payloadString = undefined;
      const testfilters = [];

      expect(() =>
        service.filterToken(headerString, payloadString, testfilters),
      ).toThrow('The payload-string was undefined');
    });
    it('should raise an error if the filter-list is undefined', () => {
      const headerString = '';
      const payloadString = '';
      const testfilters = undefined;

      expect(() =>
        service.filterToken(headerString, payloadString, testfilters),
      ).toThrow('The filter-list was undefined');
    });
    it('should return empty strings if the header and payload are empty', () => {
      const headerString = '';
      const payloadString = '';
      const testfilters = [];

      const [headerResult, payloadResult] = service.filterToken(
        headerString,
        payloadString,
        testfilters,
      );

      expect(headerResult).toBe('');
      expect(payloadResult).toBe('');
    });
    it('should return the same strings if the filters are empty', () => {
      const headerString = '{"alg": "RS256","typ": "JWT"}';
      const payloadString =
        '{"exp": 1656942591,"iat": 1656942531,"aud": "account","typ": "Bearer",' +
        '"azp": "openid-doc","acr": "1","realm_access": {"roles": ["offline_access","uma_authorization"]},' +
        '"scope": "profile email","clientHost": "172.17.0.1","clientId": "openid-doc"}';
      const testfilters = [];

      const [headerResult, payloadResult] = service.filterToken(
        headerString,
        payloadString,
        testfilters,
      );

      expect(headerResult).toBe('{\n  "alg": "RS256",\n  "typ": "JWT"\n}');
      expect(payloadResult).toBe(
        '{\n  "exp": 1656942591,\n  "iat": 1656942531,\n  "aud": "account",\n  "typ": "Bearer",\n  ' +
          '"azp": "openid-doc",\n  "acr": "1",\n  "realm_access": {\n    "roles": [\n      "offline_access",\n      "uma_authorization"\n    ]\n  },\n  ' +
          '"scope": "profile email",\n  "clientHost": "172.17.0.1",\n  "clientId": "openid-doc"\n}',
      );
    });
    it('should return only the wanted parameters if the filters are set', () => {
      const headerString = '{"alg": "RS256","typ": "JWT"}';
      const payloadString =
        '{"exp": 1656942591,"iat": 1656942531,"aud": "account","typ": "Bearer",' +
        '"azp": "openid-doc","acr": "1","realm_access": {"roles": ["offline_access","uma_authorization"]},' +
        '"scope": "profile email","clientHost": "172.17.0.1","clientId": "openid-doc"}';
      const testfilters = ['alg', 'scope', 'exp'];

      const [headerResult, payloadResult] = service.filterToken(
        headerString,
        payloadString,
        testfilters,
      );

      expect(headerResult).toBe('{\n  "alg": "RS256"\n}');
      expect(payloadResult).toBe(
        '{\n  "scope": "profile email",\n  "exp": 1656942591\n}',
      );
    });
  });
});

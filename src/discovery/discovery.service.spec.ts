import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService } from './discovery.service';
import { SettingsModule } from '../settings/settings.module';
import { HelperModule } from '../helper/helper.module';
import { ExtendedProtocolModule } from '../extended-protocol/extended-protocol.module';

describe('DiscoveryService', () => {
  let service: DiscoveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SettingsModule, HelperModule, ExtendedProtocolModule],
      providers: [DiscoveryService],
    }).compile();

    service = module.get<DiscoveryService>(DiscoveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get_issuer', () => {
    it('should fail if no issuer is provided', async () => {
      await expect(service.get_issuer(undefined)).rejects.toThrow(
          'There was no issuer string passed to get the issuer',
      );
    });

    it('should fail is an empty issuer is provided', async () => {
      await expect(service.get_issuer('')).rejects.toThrow(
          'There was no issuer string passed to get the issuer',
      );
    });
  });
});

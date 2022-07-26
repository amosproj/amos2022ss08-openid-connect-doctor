import { Test, TestingModule } from '@nestjs/testing';
import {ExtendedProtocolService} from "./extended-protocol.service";


describe('ExtendedProtocolService', () => {
  let service: ExtendedProtocolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExtendedProtocolService],
    }).compile();

    service = module.get<ExtendedProtocolService>(ExtendedProtocolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
 describe('extendedLog', () => {
    it('should fail if undefined or no message is provided', async () => {
      await expect(
          service.extendedLog(undefined),
      ).rejects.toThrow('Extended Log message can not be undefined or null');
    });

    describe('extendedLogError', () => {
      it('should fail if issuer undefined or no message is provided', async () => {
        await expect(
            service.extendedLogError(undefined),
        ).rejects.toThrow('Extended Log Error message can not be undefined or null');
      });
    });

    describe('extendedLogSuccess', () => {
      it('should fail if undefined or no message is provided', async () => {
        await expect(
            service.extendedLogSuccess(undefined),
        ).rejects.toThrow('Extended Log Success message can not be undefined or null');
      });
    });

    describe('extendedLogHelper', () => {
      it('should fail if undefined or no message and undefined color is provided', async () => {
        await expect(
            service.extendedLogHelper(undefined,undefined),
        ).rejects.toThrow('Extended Log Helper can not be undefined or null');
      });
    });

  });
});

//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Md Golam Muktadir <golam.muktadir@fau.de>


import { Test, TestingModule } from '@nestjs/testing';
import { ProtocolService } from './protocol.service';
import { ExtendedProtocolModule } from '../extended-protocol/extended-protocol.module';

describe('ProtocolService', () => {
  let service: ProtocolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ExtendedProtocolModule],
      providers: [ProtocolService],
    }).compile();

    service = module.get<ProtocolService>(ProtocolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('toggleWriteStatus', () => {
    it('should fail if no flag is provided', async () => {
      await expect(service.toggleWriteStatus(undefined)).rejects.toThrow(
        'Invalid toggle flag values received',
      );
    });
  });

  describe('writeLoggerToFile', () => {
    it('should fail if no flag is provided', async () => {
      await expect(service.writeLoggerToFile(undefined)).rejects.toThrow(
        'Log can not be empty or null',
      );
    });
  });

  describe('tempLogStore', () => {
    it('should fail if no flag is provided', async () => {
      await expect(service.tempLogStore(undefined, undefined)).rejects.toThrow(
        'Log or Status code can not be empty or null',
      );
    });
  });

  describe('myStringify', () => {
    it('should fail if no flag is provided', async () => {
      await expect(service.myStringify(undefined)).rejects.toThrow(
        'Log file can not be empty or null',
      );
    });
  });
});

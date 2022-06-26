import { Test, TestingModule } from '@nestjs/testing';
import { UtilsService } from './utils.service';

describe('UtilsService', () => {
  let service: UtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilsService],
    }).compile();

    service = module.get<UtilsService>(UtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('writeOutput', () => {
    it('should fail if programme output is undefined', () => {
      expect(service.writeOutput(undefined)).rejects.toThrow(
        'The given program output is either undefined or empty',
      );
    });

    it('should fail if programme output is null', () => {
      expect(service.writeOutput(null)).rejects.toThrow(
        'The given program output is either undefined or empty',
      );
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { FlowsService } from './flows.service';
import { TokenModule } from '../token/token.module';
import { DiscoveryModule } from '../discovery/discovery.module';

describe('FlowsService', () => {
  let service: FlowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TokenModule, DiscoveryModule],
      providers: [FlowsService],
    }).compile();

    service = module.get<FlowsService>(FlowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

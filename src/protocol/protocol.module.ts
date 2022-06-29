import { Module } from '@nestjs/common';
import { ProtocolController } from './protocol.controller';
import { ProtocolService } from './protocol.service';
import { ExtendedProtocolModule } from '../extended-protocol/extended-protocol.module';

@Module({
  imports: [ ExtendedProtocolModule ],
  controllers: [ProtocolController],
  providers: [ProtocolService],
  exports: [ProtocolService],
})
export class ProtocolModule {

}

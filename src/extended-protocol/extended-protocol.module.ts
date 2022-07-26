import { Module } from '@nestjs/common';
import { ExtendedProtocolService } from './extended-protocol.service';


@Module({
    providers: [ExtendedProtocolService],
    exports: [ExtendedProtocolService],
})
export class ExtendedProtocolModule {}

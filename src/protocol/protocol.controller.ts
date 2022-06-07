import {Controller, Get, Query, Render} from '@nestjs/common';
import {ProtocolService} from "./protocol.service";

@Controller('protocol')
export class ProtocolController {
    constructor(private readonly protocolService: ProtocolService) {}
    @Get('toggleLogger')
    async discover_issuer(
        @Query('toggleLogger') toggleLogger: number){
         this.protocolService.toggleWriteStatus(toggleLogger);
    }

}

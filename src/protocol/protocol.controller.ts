import {Controller, Get, Query, Render, Res} from '@nestjs/common';
import {ProtocolService} from "./protocol.service";
import {Response} from "express";

@Controller('protocol')
export class ProtocolController {
    constructor(private readonly protocolService: ProtocolService) {}
    @Get('toggleLogger')
    async discover_issuer(
        @Query('toggleLogger') toggleLogger: number){
         await this.protocolService.toggleWriteStatus(toggleLogger);
    }

}

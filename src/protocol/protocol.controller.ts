import {Controller, Get, Logger, NestMiddleware, Query, Render, Res} from '@nestjs/common';
import {ProtocolService} from "./protocol.service";

@Controller('protocol')
export class ProtocolController {
    constructor(private readonly protocolService: ProtocolService) {}

    @Get('logger')
    showLogMessage(){
        const readLastLines = require('read-last-lines');
        readLastLines.read('../amos2022ss08-openid-connect-doctor/src/protocol/logger.txt', 2)
            .then((lines) => console.log(lines));
         return {
             statusCode: 0,
             color:'red',
             info: "I am log",
             previously_checked: 1,
        };

    }

    @Get('toggleLogger')
    async toggleLogger(
        @Query('toggleLogger') toggleLogger: number){
         await this.protocolService.toggleWriteStatus(toggleLogger);
    }





}

import {
    Controller,
    Get,
    InternalServerErrorException,
    Logger,
    NestMiddleware,
    Query,
    Render,
    Res
} from '@nestjs/common';
import {ProtocolService} from "./protocol.service";
import {name} from "ts-jest/dist/transformers/hoist-jest";
import {ProtocolLogger} from "./protocolLogger";

@Controller('protocol')
export class ProtocolController {
    constructor(private readonly protocolService: ProtocolService) {}

    @Get('logger')
    @Render('protocol')
    showLogMessage(){
        const readLastLines = require('read-last-lines');
        let data:any;
      return  readLastLines.read('../amos2022ss08-openid-connect-doctor/src/protocol/templogger.txt', 5)
            .then((lines) =>{
                let listOfObjects = [];
                let splitLines = lines.split("\n");
                 console.log(splitLines.length)
                for(let i=splitLines.length-2; i>=0; i--){
                    let decode=splitLines[i].split(">>");
                    let obj= new ProtocolLogger(decode[1],decode[0],i+1);
                     listOfObjects.push(obj);
                }
                console.log("#####");
                console.log(listOfObjects);
                data=JSON.stringify(listOfObjects,null,4);
                return {result: data};
            }).catch((e:any) => {
            throw new InternalServerErrorException('Could not create user');
            return e;
        });

    }

    @Get('toggleLogger')
    async toggleLogger(
        @Query('toggleLogger') toggleLogger: number){
         await this.protocolService.toggleWriteStatus(toggleLogger);
    }





}

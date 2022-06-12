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
import {ProtocolLogger} from "./protocolLogger";

@Controller('protocol')
export class ProtocolController {
    constructor(private readonly protocolService: ProtocolService) {}

    @Get('logger')
    @Render('protocol')
    async showLogMessage(){
        const readLastLines = require('read-last-lines');
        let data:any;
        return readLastLines.read('./src/protocol/tempLogger.txt', 5)
            .then((lines) =>{
                let listOfObjects = [];
                let splitLines = lines.split("\n");
                console.log(splitLines.length)
                let counter=0;
                for(let i=splitLines.length-2; i>=0; i--){
                    let decode=splitLines[i].split(">>");
                    let obj= new ProtocolLogger(decode[1],decode[0],++counter);
                     listOfObjects.push(obj);
                }
                console.log("#####");
                console.log(listOfObjects);
                data = this.protocolService.myStringify(listOfObjects);
                return {result: data};
            })
            .catch((e:any) => {
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

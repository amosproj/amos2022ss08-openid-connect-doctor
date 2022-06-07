import {Injectable, Logger} from '@nestjs/common';

@Injectable()
export class ProtocolService {
    logger: Logger;
    constructor() {
        this.logger = new Logger(ProtocolService.name);
    }

    writeLoggerToFile(logMessage:string): void {
        const fs = require('fs');
        const dirPath="../amos2022ss08-openid-connect-doctor/src/protocol/";
        if(fs.existsSync(dirPath)){
            fs.writeFileSync(dirPath+"/logger.txt","\n "+logMessage, {flag:"a"});
           return  this.logger.log("write Successful")

        }else{
          return  this.logger.error(`${dirPath} not found`)
        }

    }

}

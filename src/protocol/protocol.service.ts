import {Injectable, Logger, Res} from '@nestjs/common';
import {Response} from "express";

@Injectable()
export class ProtocolService {
    logger: Logger;
    toggle:number=1;
    constructor() {
        this.logger = new Logger(ProtocolService.name);
    }
    async toggleWriteStatus(flag:number){
        this.toggle=flag;
        this.logger.error("Value changed to: "+this.toggle);
    }

    writeLoggerToFile(logMessage:string): void {
        const fs = require('fs');
        let dateTime = new Date();
        const dirPath="../amos2022ss08-openid-connect-doctor/src/protocol/";
        this.logger.warn("value of toggle before writeing : "+this.toggle);
        if(this.toggle == 1) {
            if (fs.existsSync(dirPath)) {
                fs.writeFileSync(dirPath + "/logger.txt", dateTime + " :: " + logMessage + "\n", {flag: "a"});
                return this.logger.log("write Successful")

            } else {
                return this.logger.error(`${dirPath} not found`)
            }
        }else{
            return this.logger.warn("No write permission in the logger file.Enable Checkbox to write logs in the file");
        }

    }

    tempLogStore(logMessage:string, statusCode:number): void {
        const fs = require('fs');
        let dateTime = new Date();
        const dirPath="../amos2022ss08-openid-connect-doctor/src/protocol/";
            if (fs.existsSync(dirPath)) {
                fs.writeFileSync(dirPath + "/tempLogger.txt", statusCode+" ## "+dateTime + " :: " + logMessage + "\n", {flag: "a"});
                return this.logger.log("write Successful")

            } else {
                return this.logger.error(`${dirPath} not found`)
            }

    }


}

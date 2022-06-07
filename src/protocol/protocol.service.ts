import {Injectable, Logger} from '@nestjs/common';

@Injectable()
export class ProtocolService {
    logger: Logger;
    toggle:number=1;
    constructor() {
        this.logger = new Logger(ProtocolService.name);
    }
    toggleWriteStatus(flag:number){
        this.toggle=flag;
    }

    writeLoggerToFile(logMessage:string): void {
        const fs = require('fs');
        let dateTime = new Date();
        const dirPath="../amos2022ss08-openid-connect-doctor/src/protocol/";
        if(this.toggle==1) {
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

}

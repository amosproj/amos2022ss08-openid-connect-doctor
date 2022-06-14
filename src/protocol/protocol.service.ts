import {HttpException, Injectable, Logger, Res} from '@nestjs/common';
import {Response} from "express";

@Injectable()
export class ProtocolService {
    logger: Logger;
    toggle:number=1;
    constructor() {
        this.logger = new Logger(ProtocolService.name);
    }
    async toggleWriteStatus(flag:number){
        if (flag === undefined || flag >1 || flag <0) {
            throw new HttpException(
                'Invalid toggle flag values received',
                400,
            );
        }
        this.toggle=flag;
        this.logger.error("Value changed to: "+this.toggle);
    }

   async writeLoggerToFile(logMessage:string){
        if (logMessage === undefined || logMessage===null ) {
            throw new HttpException(
                'Log can not be empty or null',
                400,
            );
        }
        const fs = require('fs');
        let dateTime = new Date();
        const dirPath="../amos2022ss08-openid-connect-doctor/logfiles/";
        this.logger.warn("value of toggle before writing : "+this.toggle);
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

   async tempLogStore(logMessage:string, statusCode:number){
        if (logMessage === undefined || logMessage===null || statusCode===undefined) {
            throw new HttpException(
                'Log or Status code can not be empty or null',
                400,
            );
        }
        const fs = require('fs');
        let dateTime = new Date();
        const dirPath="../amos2022ss08-openid-connect-doctor/logfiles/";
            if (fs.existsSync(dirPath)) {
                fs.writeFileSync(dirPath + "/tempLogger.txt", statusCode+" >> "+dateTime + " :: " + logMessage + "\n", {flag: "a"});
                return this.logger.log("write Successful")

            } else {
                return this.logger.error(`${dirPath} not found`)
            }

    }

    async myStringify(log:any) {
        if (log === undefined || log===null ) {
            throw new HttpException(
                'Log file can not be empty or null',
                400,
            );
        }
        let res = '[\n';
        for (let i = 0; i < log.length; i++) {
            const logEntry = log[i];
            const sc = parseInt(logEntry.statusCode);
            let red = false;
            if (sc < 200 || sc >= 300) {
                red = true;
                res = res + '<span style="color:red">'
            }
            res = res + JSON.stringify(logEntry, null, 2) + ',\n';
            if (red) {
                res = res + '</span>';
            }
        }
        res = res + '\n]';
        return res;
    }
}

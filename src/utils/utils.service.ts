import {HttpException, Injectable, Logger} from '@nestjs/common';

@Injectable()
export class UtilsService {
    logger: Logger;
    constructor() {
        this.logger = new Logger(UtilsService.name);
    }

    async writeOutput(programOutput: any) {
        if (
            programOutput === undefined ||
            programOutput === null
        ) {
            throw new HttpException(
                'Log or Status code can not be empty or null',
                400,
            );
        }

        const fs = require('fs');
        const dateTime = new Date();
        const fileName="program-output"+".txt"  
        const dirPath = '../amos2022ss08-openid-connect-doctor/logfiles/';
        if (fs.existsSync(dirPath)) {
            fs.writeFileSync(
                dirPath + '/'+fileName, + String(programOutput)+ '\n',
                { flag: 'a' },
            );
            return this.logger.log('write Successful');
        } else {
            return this.logger.error(`${dirPath} not found`);
        }
    }

}

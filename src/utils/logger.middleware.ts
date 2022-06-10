import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import {ProtocolService} from "../protocol/protocol.service";
import {ProtocolLogger} from "../protocol/protocolLogger";
import { Queue } from 'queue-typescript';


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly protocolService: ProtocolService) {}
  private logger = new Logger('HTTP');


  use(request: Request, response: Response, next: NextFunction) {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      let msg:string =`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`;
      this.logger.log(msg);

      this.protocolService.writeLoggerToFile(msg);
      this.protocolService.tempLogStore(msg,statusCode);

      if (statusCode >= 200 && statusCode <=299){
        this.logger.log("Successful Response ");
        this.logger.log( `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`, );
      }else if(statusCode >= 400 && statusCode <=499){
        this.logger.error("Client error responses ");
        this.logger.error( `${method} ${originalUrl} ${statusCode} ${contentLength} -  ${ip}`, );
      }
      else if(statusCode >= 500 && statusCode <=599){
        this.logger.error("Server error responses ");
        this.logger.error( `${method} ${originalUrl} ${statusCode} ${contentLength} -  ${ip}`, );
      }else{
        this.logger.warn("Informational or Redirect message ");
        this.logger.log(`${method} ${originalUrl} ${statusCode}`)
      }
    });

    next();
  }
}

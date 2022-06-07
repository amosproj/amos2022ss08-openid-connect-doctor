import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );

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

import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Issuer} from "openid-client";

@Injectable()
export class DiscoveryService {

    async get_issuer(issuer_s) {
        if(issuer_s === undefined || issuer_s === ''){
            throw new HttpException(
                'There was no issuer string passed to get the issuer',
                HttpStatus.BAD_REQUEST,
            );
        }
        const issuer = await Issuer.discover(issuer_s);
        return issuer;
    }

}

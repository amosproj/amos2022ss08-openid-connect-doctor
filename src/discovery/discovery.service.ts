import { Injectable } from '@nestjs/common';
import {Issuer} from "openid-client";

@Injectable()
export class DiscoveryService {

    async get_issuer(issuer_s) {
        const issuer = await Issuer.discover(issuer_s);
        return issuer;
    }

}

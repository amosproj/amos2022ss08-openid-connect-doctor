import {
    Controller,
    Get,
    Delete,
    Render,
    Query,
    HttpException,
    HttpStatus,
    Res,
    Post,
    Body,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { createReadStream, promises as fs } from 'fs';
import { join } from 'path';

import {DiscoveryService} from "./discovery.service";


@Controller('discovery')
export class DiscoveryController {
    constructor(private readonly discoveryService: DiscoveryService) {
    }

    @Get('issuer')
    @Render('index')
    async discover_issuer(
        @Query('issuer_url') issuer_url_s: string,
        @Query('authorization_endpoint') authorization_endpoint_s: string,
        @Query('claim_types_supported') claim_types_supported_s: string,
        @Query('claims_parameter_supported') claims_parameter_supported_s: string,
        @Query('claims_supported') claims_supported_s: string,
        @Query('code_challenge_methods_supported')
            code_challenge_methods_supported_s: string,
        @Query('device_authorization_endpoint')
            device_authorization_endpoint_s: string,
        @Query('grant_types_supported') grant_types_supported_s: string,
        @Query('id_token_signing_alg_values_supported')
            id_token_signing_alg_values_supported_s: string,
        @Query('issuer') issuer_s: string,
        @Query('jwks_uri') jwks_uri_s: string,
        @Query('request_parameter_supported') request_parameter_supported_s: string,
        @Query('request_uri_parameter_supported')
            request_uri_parameter_supported_s: string,
        @Query('require_request_uri_registration')
            require_request_uri_registration_s: string,
        @Query('response_modes_supported') response_modes_supported_s: string,
        @Query('response_types_supported') response_types_supported_s: string,
        @Query('revocation_endpoint') revocation_endpoint_s: string,
        @Query('revocation_endpoint_auth_methods_supported')
            revocation_endpoint_auth_methods_supported_s: string,
        @Query('scopes_supported') scopes_supported_s: string,
        @Query('subject_types_supported') subject_types_supported_s: string,
        @Query('token_endpoint') token_endpoint_s: string,
        @Query('token_endpoint_auth_methods_supported')
            token_endpoint_auth_methods_supported_s: string,
        @Query('userinfo_endpoint') userinfo_endpoint_s: string,
        @Query('schema') schema_s: string,
    ) {
        const checkboxes = this.extracted(authorization_endpoint_s, claim_types_supported_s, claims_parameter_supported_s, claims_supported_s, code_challenge_methods_supported_s, device_authorization_endpoint_s, grant_types_supported_s, id_token_signing_alg_values_supported_s, issuer_s, jwks_uri_s, request_parameter_supported_s, request_uri_parameter_supported_s, require_request_uri_registration_s, response_modes_supported_s, response_types_supported_s, revocation_endpoint_s, revocation_endpoint_auth_methods_supported_s, scopes_supported_s, subject_types_supported_s, token_endpoint_s, token_endpoint_auth_methods_supported_s, userinfo_endpoint_s);
        let keys = this.rememberSelectedParameters(checkboxes);
        return await this.checkIssuerUrlDetails(schema_s, issuer_url_s, keys, checkboxes);
    }

    private extracted(authorization_endpoint_s: string, claim_types_supported_s: string, claims_parameter_supported_s: string, claims_supported_s: string, code_challenge_methods_supported_s: string, device_authorization_endpoint_s: string, grant_types_supported_s: string, id_token_signing_alg_values_supported_s: string, issuer_s: string, jwks_uri_s: string, request_parameter_supported_s: string, request_uri_parameter_supported_s: string, require_request_uri_registration_s: string, response_modes_supported_s: string, response_types_supported_s: string, revocation_endpoint_s: string, revocation_endpoint_auth_methods_supported_s: string, scopes_supported_s: string, subject_types_supported_s: string, token_endpoint_s: string, token_endpoint_auth_methods_supported_s: string, userinfo_endpoint_s: string) {
        const checkboxes = {
            authorization_endpoint: authorization_endpoint_s,
            claim_types_supported: claim_types_supported_s,
            claims_parameter_supported: claims_parameter_supported_s,
            claims_supported: claims_supported_s,
            code_challenge_methods_supported: code_challenge_methods_supported_s,
            device_authorization_endpoint: device_authorization_endpoint_s,
            grant_types_supported: grant_types_supported_s,
            id_token_signing_alg_values_supported:
            id_token_signing_alg_values_supported_s,
            issuer: issuer_s,
            jwks_uri: jwks_uri_s,
            request_parameter_supported: request_parameter_supported_s,
            request_uri_parameter_supported: request_uri_parameter_supported_s,
            require_request_uri_registration: require_request_uri_registration_s,
            response_modes_supported: response_modes_supported_s,
            response_types_supported: response_types_supported_s,
            revocation_endpoint: revocation_endpoint_s,
            revocation_endpoint_auth_methods_supported:
            revocation_endpoint_auth_methods_supported_s,
            scopes_supported: scopes_supported_s,
            subject_types_supported: subject_types_supported_s,
            token_endpoint: token_endpoint_s,
            token_endpoint_auth_methods_supported:
            token_endpoint_auth_methods_supported_s,
            userinfo_endpoint: userinfo_endpoint_s,
        };
        return checkboxes;
    }

    private rememberSelectedParameters(checkboxes) {
        let keys = [];
        for (const key in checkboxes) {
            if (checkboxes[key] === '1') {
                keys.push(key);
            }
        }
        return keys;
    }

    private async checkIssuerUrlDetails(schema_s: string, issuer_url_s: string, keys: any[], checkboxes: { response_types_supported: string; request_parameter_supported: string; revocation_endpoint_auth_methods_supported: string; request_uri_parameter_supported: string; claims_parameter_supported: string; grant_types_supported: string; revocation_endpoint: string; scopes_supported: string; issuer: string; authorization_endpoint: string; userinfo_endpoint: string; device_authorization_endpoint: string; claims_supported: string; require_request_uri_registration: string; code_challenge_methods_supported: string; jwks_uri: string; subject_types_supported: string; claim_types_supported: string; id_token_signing_alg_values_supported: string; token_endpoint_auth_methods_supported: string; response_modes_supported: string; token_endpoint: string }) {
      let empty_schemas;
      if (schema_s === undefined) {
        empty_schemas = [''];
      } else {
        empty_schemas = [schema_s, ''];
      }
      const uploaded_schemas = await fs.readdir('schema');
      const schemas = empty_schemas.concat(uploaded_schemas.filter((x) => { return x !== schema_s; }));
        if (issuer_url_s === undefined) {
            return {
                result: {
                    success: 1,
                    info: null,
                    previously_checked: null,
                },
                short_message: 'Please input provider url',
                schemas: schemas,
            };
        }
        let short_message = 'Provider found:';
        const [ issuer_query_res, issuer_res ] = await this.discoveryService.get_issuer(issuer_url_s)
        .then((issuer) => {
            return [
                {
                    success: 1,
                    info: JSON.stringify(issuer, keys, 2),
                    previously_checked: checkboxes,
                },
                issuer,
            ];
        })
        .catch((err) => {
            return [
                {
                    success: 0,
                    info: err,
                    previously_checked: null,
                },
                null,
            ];
        });
        if (issuer_query_res.success === 0) {
            short_message = 'Error, could not find provider:';
        }
        if (issuer_query_res.success === 1 && schema_s !== '') {
            const [success, info] = await this.discoveryService.coloredFilteredValidation(
                issuer_res,
                schema_s,
                keys,
            );
            issuer_query_res.success = success;
            issuer_query_res.info = info;
            if (success === 0) {
                short_message = 'Provider did not match schema';
            }
        }
        return {
            result: issuer_query_res,
            short_message: short_message,
            schemas: schemas,
        };
    }

    @Post('/schema/upload')
    @UseInterceptors(FileInterceptor('upload'))
    async uploadSchema(@UploadedFile() file: Express.Multer.File, @Res() res) {
        console.log(file);
        await fs.writeFile(join(process.cwd(), 'schema', file.originalname), file.buffer);
        res.status(302).redirect('/api/discovery/issuer');
    }

    @Get('/schema/download')
    downloadSchema(@Query('schema') schema_s: string, @Res() res: Response) {
        const file = createReadStream(join(process.cwd(), 'schema', schema_s));
        file.pipe(res);
    }

    @Get('/schema/delete')
    async deleteSchema(@Query('schema') schema_s: string, @Res() res: Response) {
        await fs.unlink(join(process.cwd(), 'schema', schema_s));
        res.status(302).redirect('/api/discovery/issuer');
    }

}

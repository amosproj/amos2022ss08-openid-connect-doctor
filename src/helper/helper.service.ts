import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Issuer } from "openid-client";
import Ajv, { JSONSchemaType } from "ajv"
import { promises as fs } from 'fs';
import { join } from 'path';
import { SettingsService } from '../settings/settings.service';
import { ExtendedProtocolService } from '../extended-protocol/extended-protocol.service';

@Injectable()
export class HelperService {
    @Inject(SettingsService)
    private readonly settingsService: SettingsService;
    @Inject(ExtendedProtocolService)
    private readonly protocolService: ExtendedProtocolService;

    async getSchemasHelper(schema_s: string, sub_system: string) {
        let empty_schemas;
        if (schema_s === undefined) {
            empty_schemas = [ this.settingsService.config[sub_system].validation_schema, '' ]
        } else if (schema_s === '') {
            empty_schemas = [''];
        } else {
            empty_schemas = [schema_s, ''];
        }
        const uploaded_schemas = await fs.readdir(join('schema', sub_system));
        return empty_schemas.concat(uploaded_schemas.filter((x) => { return x !== schema_s; }));
    }

    async get_issuer(issuer_s) {
        if(issuer_s === undefined || issuer_s === ''){
            throw new HttpException(
                'There was no issuer string passed to get the issuer',
                HttpStatus.BAD_REQUEST,
            );
        }
        this.protocolService.extendedLog(`Query issuer at url ${issuer_s}`);
        const issuer = await Issuer.discover(issuer_s)
        .then((issuer) => {
            this.protocolService.extendedLogSuccess(`Information for issuer ${issuer_s} successfully received:\n${JSON.stringify(issuer, undefined, 2)}`);
            return issuer;
        }).catch((err) => {
            this.protocolService.extendedLogError(`Unable to retrieve info for issuer ${issuer_s}: ${err}`);
            throw new HttpException('No issuer found!', 404);
            return null;
        });
        return issuer;
    }
    async validateJson(issuer: object, schema: object) {
        const ajv = new Ajv();
        this.protocolService.extendedLog("Start validation against schema");
        this.protocolService.extendedLog(`Object to validate:\n${JSON.stringify(issuer, undefined, 2)}`);
        this.protocolService.extendedLog(`Schema to validate against:\n${JSON.stringify(schema, undefined, 2)}`);
        const validate = ajv.compile(schema);
        let success = validate(issuer);
        if (success) {
            this.protocolService.extendedLogSuccess("Validation successful");
        } else {
            this.protocolService.extendedLogError(`Validation failed with error:\n${validate.errors}`);
        }
        return [success, validate.errors];
    }

    myStringify(issuer, required, keys) {
        let res = '{\n';
        let first = true;
        for (const key in issuer) {
            if (keys.includes(key)) {
                if (!first) {
                    res = res + ',\n';
                }
                if (required.includes(key)) {
                    res = res + `  "${key}": ` + '<span style="color:green">' + JSON.stringify(issuer[key]) + '</span>';
                } else {
                    res = res + `  "${key}": ` + JSON.stringify(issuer[key], null, 2);
                }
                first = false;
            }
        }
        res = res + '\n}';
        return res;
    }

    async coloredFilteredValidationWithFileContent(issuer: object, schema: any, keys: any[]) {
        const [ valid, errors ] = await this.validateJson(issuer, schema);
        if (valid) {
            const required = schema.required;
            return [1, this.myStringify(issuer, required, keys)];
        } else {
            return [0, JSON.stringify(errors, null, 2)];
        }
    }
}

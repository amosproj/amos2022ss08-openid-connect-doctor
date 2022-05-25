import { Controller, Get, Render, Query } from '@nestjs/common';
import { Issuer } from 'openid-client';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return;
  }

  async get_issuer(issuer_s) {
    const issuer = await Issuer.discover(issuer_s);
    return issuer;
  }

  @Get('issuer')
  @Render('index')
  async discover_issuer(@Query('issuer_url') issuer_url_s: string,
    @Query('authorization_endpoint') authorization_endpoint_s: string,
    @Query('claim_types_supported') claim_types_supported_s: string,
    @Query('claims_parameter_supported') claims_parameter_supported_s: string,
    @Query('claims_supported') claims_supported_s: string,
    @Query('code_challenge_methods_supported') code_challenge_methods_supported_s: string,
    @Query('device_authorization_endpoint') device_authorization_endpoint_s: string,
    @Query('grant_types_supported') grant_types_supported_s: string,
    @Query('id_token_signing_alg_values_supported') id_token_signing_alg_values_supported_s: string,
    @Query('issuer') issuer_s: string,
    @Query('jwks_uri') jwks_uri_s: string,
    @Query('request_parameter_supported') request_parameter_supported_s: string,
    @Query('request_uri_parameter_supported') request_uri_parameter_supported_s: string,
    @Query('require_request_uri_registration') require_request_uri_registration_s: string,
    @Query('response_modes_supported') response_modes_supported_s: string,
    @Query('response_types_supported') response_types_supported_s: string,
    @Query('revocation_endpoint') revocation_endpoint_s: string,
    @Query('revocation_endpoint_auth_methods_supported') revocation_endpoint_auth_methods_supported_s: string,
    @Query('scopes_supported') scopes_supported_s: string,
    @Query('subject_types_supported') subject_types_supported_s: string,
    @Query('token_endpoint') token_endpoint_s: string,
    @Query('token_endpoint_auth_methods_supported') token_endpoint_auth_methods_supported_s: string,
    @Query('userinfo_endpoint') userinfo_endpoint_s: string) {
    const checkboxes = new Map([
      ['authorization_endpoint', authorization_endpoint_s],
      ['claim_types_supported', claim_types_supported_s],
      ['claims_parameter_supported', claims_parameter_supported_s],
      ['claims_supported', claims_supported_s],
      ['code_challenge_methods_supported', code_challenge_methods_supported_s],
      ['device_authorization_endpoint', device_authorization_endpoint_s],
      ['grant_types_supported', grant_types_supported_s],
      ['id_token_signing_alg_values_supported', id_token_signing_alg_values_supported_s],
      ['issuer', issuer_s],
      ['jwks_uri', jwks_uri_s],
      ['request_parameter_supported', request_parameter_supported_s],
      ['request_uri_parameter_supported', request_uri_parameter_supported_s],
      ['require_request_uri_registration', require_request_uri_registration_s],
      ['response_modes_supported', response_modes_supported_s],
      ['response_types_supported', response_types_supported_s],
      ['revocation_endpoint', revocation_endpoint_s],
      ['revocation_endpoint_auth_methods_supported', revocation_endpoint_auth_methods_supported_s],
      ['scopes_supported', scopes_supported_s],
      ['subject_types_supported', subject_types_supported_s],
      ['token_endpoint', token_endpoint_s],
      ['token_endpoint_auth_methods_supported', token_endpoint_auth_methods_supported_s],
      ['userinfo_endpoint', userinfo_endpoint_s],
    ]);
    let keys = [];
    checkboxes.forEach(function (value, key) {
      if (value === '1') {
        keys.push(key);
      }
    });
    return {
      result: await this.get_issuer(issuer_s)
        .then((issuer) => {
          //console.log(issuer);
          return {
            success: 1,
            info: JSON.stringify(issuer, keys, 2),
          };
        })
        .catch((err) => {
          return {
            success: 0,
            info: err,
          };
        }),
    };
  }
}

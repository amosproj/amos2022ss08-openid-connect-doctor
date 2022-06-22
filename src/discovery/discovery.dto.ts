export class DiscoveryDto {
    schema: string;
    issuer_url: string
    authorization_endpoint_s: string;
    claim_types_supported_s: string;
    claims_parameter_supported_s: string;
    claims_supported_s: string;
    code_challenge_methods_supported_s: string;
    device_authorization_endpoint_s: string;
    grant_types_supported_s: string;
    id_token_signing_alg_values_supported_s: string;
    issuer_s: string;
    jwks_uri_s: string;
    request_parameter_supported_s: string;
    request_uri_parameter_supported_s: string;
    require_request_uri_registration_s: string;
    response_modes_supported_s: string;
    response_types_supported_s: string;
    revocation_endpoint_s: string;
    revocation_endpoint_auth_methods_supported_s: string;
    scopes_supported_s: string;
    subject_types_supported_s: string;
    token_endpoint_s: string;
    token_endpoint_auth_methods_supported_s: string;
    userinfo_endpoint_s: string;
}

# Required information

1. **Authentication Server (Authorisation endpoint URL)**

The JWT token has to come from the authentication server. That will be defined as a URL.
![][pictures/client-authentication-token.png]
Therefore, the address of the authentication server (OpenID) is required to request a token.

2. **Authorized Applications**

Client applications have to be registered at the authentication server, that they can execute OAuth 2.0 grants before you can request tokens.
There is the [implicit grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.2) and the refreshing [authorization code grant](https://datatracker.ietf.org/doc/html/rfc6749#section-4.1) possible.

3. **Registration Token**

A registration token is required to receive access to tokens. That can be requested with curl.
Example from [https://connect2id.com/products/server/docs/guides/client-registration](https://connect2id.com/products/server/docs/guides/client-registration):
```
curl -s -XPOST -H "Content-Type:application/json" \
-H "Authorization: Bearer ztucZS1ZyFKgh0tUEruUtiSTXhnexmd6" \
-d '{"redirect_uris":["https://client.example.org/callback"]}' \
https://demo.c2id.com/clients
```

Afterwards you should be able to receive following registration access information like that:
```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-store
Pragma: no-cache

{
  "client_id"                    : "5def774h6caci",
  "client_id_issued_at"          : 1412671298,
  "client_secret"                : "AITXP49gecnFP83u1Mjot9xz7Hgu4u4lYBrTxvNtq1k",
  "client_secret_expires_at"     : 0,
  "registration_client_uri"      : "https://demo.c2id.com/clients/5def774h6caci",
  "registration_access_token"    : "jZNmlyJeo3V2j14fynmDthWjbizNYe2fc5pYW27fReo",
  "grant_types"                  : [ "authorization_code" ],
  "response_types"               : [ "code" ],
  "redirect_uris"                : [ "https://client.example.org/callback" ],
  "token_endpoint_auth_method"   : "client_secret_basic",
  "application_type"             : "web",
  "subject_type"                 : "public",
  "id_token_signed_response_alg" : "RS256",
  "require_auth_time"            : false
}
```

4) **Registration for Client Secret JWT**

If you want to register for a client secret JWT authentication, you have to make request like this:
```
POST /clients HTTP/1.1
Host: demo.c2id.com
Content-Type: application/json

{
  "redirect_uris"                   : [ "https://client.example.org/callback" ],
  "token_endpoint_auth_method"      : "client_secret_jwt",
  "token_endpoint_auth_signing_alg" : "HS256"
}
```
That generates a key plair. Then you have to export the public key to a JSON Web Key (JWK) set, so that it can be registered for the OpenID Connect server.

5) **Signature and Encryption**

The JWT tokens are encrypted by default for data security. You need the public key for being able to decypt the data, if they are encrypted.
The signature is available for verification. That will be done with JSON Web Signatures, which are useful features of JWT.

A JWE JSON Serialization can look like:
```
{
"protected": "eyJlbmMiOiJBMTI4Q0JDLUhTMjU2In0",
"unprotected": { "jku":"https://server.example.com/keys.jwks" },
"header": { "alg":"RSA1_5","kid":"2011-04-29" },
"encrypted_key":
"UGhIOguC7IuEvf_NPVaXsGMoLOmwvc1GyqlIKOK1nN94nHPoltGRhWhw7Zx0-
kFm1NJn8LE9XShH59_i8J0PH5ZZyNfGy2xGdULU7sHNF6Gp2vPLgNZ__deLKx
GHZ7PcHALUzoOegEI-8E66jX2E4zyJKx-YxzZIItRzC5hlRirb6Y5Cl_p-ko3
YvkkysZIFNPccxRU7qve1WYPxqbb2Yw8kZqa2rMWI5ng8OtvzlV7elprCbuPh
cCdZ6XDP0_F8rkXds2vE4X-ncOIM8hAYHHi29NX0mcKiRaD0-D-ljQTP-cFPg
wCp6X-nZZd9OHBv-B3oWh2TbqmScqXMR4gp_A",
"iv": "AxY8DCtDaGlsbGljb3RoZQ",
"ciphertext": "KDlTtXchhZTGufMYmOYGS4HffxPSUrfmqCHXaI9wOGY",
"tag": "Mz-VPPyU4RlcuYv1IwIvzw"
}
```
[Peyrott, Sebastian: JWT Handbook]

6) **Keystore**

We need a keystore for managing keys, that you can access the authentication server continuously.
node-jose is a possible tool to decrypt data from JWE.

Useful literature:
1. [JWT Handbook with code examples:](https://auth0.com/resources/ebooks/jwt-handbook/thankyou)

2. [Client Registration](https://connect2id.com/products/server/docs/guides/client-registration)

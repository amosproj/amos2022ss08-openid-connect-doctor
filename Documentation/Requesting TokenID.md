# Requesting TokenID

Depending on how the TokenID and Access Token are returned to the Client, there are three paths for Authentication:
+ Authorization Code Flow (response_type=code)
+ Implicit Flow (response_type=id_token token or response_type=id_token)
+ Hybrid Flow 


## Authorization Code Flow
The following steps implies the Authorization Code Flow:

>1. Client prepares an Authentication Request containing the desired request parameters.
>2. Client sends the request to the Authorization Server.
>3.  Authorization Server Authenticates the End-User.
>4.  Authorization Server obtains End-User Consent/Authorization.
>5.  Authorization Server sends the End-User back to the Client with an Authorization Code.
>6.  Client requests a response using the Authorization Code at the Token Endpoint.
>7.  Client receives a response that contains an ID Token and Access Token in the response body.
>8.  Client validates the ID token and retrieves the End-User's Subject Identifier.

Requesting TokenID could be placed only when the Authorization Server has sent the End-User back to the client whith an Authorization Code.
To obtain an Access Token, an ID Token, and optionally a Refresh Token, the RP (Client) sends a Token Request to the Token Endpoint to obtain a Token Response when using the Authorization Code Flow. 

The RP makes a Token Request by presenting its Authorization Grant (in the form of an Authorization Code) to the Token Endpoint using the  *grant_type*  value  *authorization_code*. If the RP is a Confidential Client, then it MUST authenticate to the Token Endpoint using the authentication method registered for its  *client_id*.

The RP sends the parameters to the Token Endpoint using the HTTP  POST  method and the Form Serialization.

A non-normatice example of a token request is stated below:

>POST /token HTTP/1.1
>Host: server.example.com
>Content-Type: application/x-www-form-	urlencoded
>Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
>
>  grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
>	  &redirect_uri=https%3A%2F%2Fclient.example.org%2Fcb



## Implicit Flow

Implicit Flow is identical to the Authorization Code flow in the until the point the Authorization gets the End-User Consent/ Authorization. However, no Authorization code is exchanged between the Authorization Server, Client and Token Endpoint.
 
>    1. Client prepares an Authentication Request containing the desired request parameters.
>	2. Client sends the request to the Authorization Server.
>	3.  Authorization Server Authenticates the End-User.
>	4.  Authorization Server obtains End-User Consent/Authorization.
>	5.  Authorization Server sends the End-User back to the Client with an ID Token and, if requested, an Access Token.
>	6.  Client validates the ID token and retrieves the End-User's Subject Identifier.

Once the Authentication response is arrived, the URI is redirected and the Authentication response must be validated by the Client. 

Access Token issued by the Authorization Endpoint should be validated by the Client through the following steps:

1.  Hash the octets of the ASCII representation of the  access_token  with the hash algorithm specified in  **JWA** for the  *alg*  Header Parameter of the ID Token's JOSE Header. For instance, if the  *alg*  is  *RS256*, the hash algorithm used is SHA-256.
2.  Take the left-most half of the hash and base64url encode it.
3.  The value of  *at_hash*  in the ID Token MUST match the value produced in the previous step.

Furthermore, for the ID Token in the Implicit Flow, the following Claims do also exist:
	
>**nonce**
	>Use of the  nonce  Claim is REQUIRED for this flow.
>
>**at_hash**
	Access Token hash value. Its value is the base64url encoding of the left-most half of the hash of the octets of the ASCII representation of the  access_token  value, where the hash algorithm used is the hash algorithm used in the  alg  Header Parameter of the ID Token's JOSE Header. For instance, if the  alg  is  RS256, hash the  access_token  value with SHA-256, then take the left-most 128 bits and base64url encode them. The  at_hash  value is a case sensitive string.


## Hybrid Flow
This method is quite similar to the Authorization Code flow with having more additional parameters depending on the response.
>
>1.  Client prepares an Authentication Request containing the desired request parameters.
>	2.  Client sends the request to the Authorization Server.
>	3.  Authorization Server Authenticates the End-User.
>	4.  Authorization Server obtains End-User Consent/Authorization.
>	5.  Authorization Server sends the End-User back to the Client with an Authorization Code and, depending on the Response Type, one or more additional parameters.
>	6.  Client requests a response using the Authorization Code at the Token Endpoint.
>	7.  Client receives a response that contains an ID Token and Access Token in the response body.
>	8.  Client validates the ID Token and retrieves the End-User's Subject Identifier.
When using the Hybrid Flow, Access Tokens returned from the Authorization Endpoint are validated in the same manner as for the Implicit Flow.

Following, the steps to validation of an Authorization Code which is issued from the Authorization Endpoint are stated, which should be taken by the RP:

1.  Hash the octets of the ASCII representation of the  *code*  with the hash algorithm specified in  **JWA** for the  *alg*  Header Parameter of the ID Token's JOSE Header. For instance, if the  *alg*  is  *RS256*, the hash algorithm used is SHA-256.
2.  Take the left-most half of the hash and base64url encode it.
3.  The value of  c_hash  in the ID Token MUST match the value produced in the previous step if  *c_hash*  is present in the ID Token.

When using the Hybrid Flow, these additional requirements for the following ID Token Claims apply to an ID Token returned from the Authorization Endpoint:

> **nonce**
> Use of the  *nonce  Claim* is REQUIRED for this flow.
> 
> **at_hash**
> Access Token hash value. Its value is the base64url encoding of the left-most half of the hash of the octets of the ASCII representation of the  *access_token*  value, where the hash algorithm used is the hash algorithm used in the  *alg*  Header Parameter of the ID Token's JOSE Header. For instance, if the  *alg*  is  *RS256*, hash the  *access_token*  value with SHA-256, then take the left-most 128 bits and base64url encode them. The  *at_hash*  value is a case sensitive string.
> If the ID Token is issued from the Authorization Endpoint with an  *access_token*  value, which is the case for the  *response_type*  value  code *id_token token*, this is REQUIRED; otherwise, its inclusion is OPTIONAL.
> 
> **c_hash**
> Code hash value. Its value is the base64url encoding of the left-most half of the hash of the octets of the ASCII representation of the  *code*  value, where the hash algorithm used is the hash algorithm used in the  *alg*  Header Parameter of the ID Token's JOSE Header. For instance, if the  *alg*  is  *HS512*, hash the  code  value with SHA-512, then take the left-most 256 bits and base64url encode them. The * c_hash* value is a case sensitive string.
> If the ID Token is issued from the Authorization Endpoint with a  *code*, which is the case for the  *response_type*  values  code *id_token*  and  code *id_token* token, this is REQUIRED; otherwise, its inclusion is optional.



Useful Literature:

[OpenID Connect Core 1.0 incorporating errata set 1](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest)
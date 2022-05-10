# Required information

**Token**

An individual instance of a type of symbol something serving as a sign of something else.

**Identity provider**

The Identity Provider authenticates the user and provides an authentication token (that is, information that verifies the authenticity of the user) to the service provider.
The identity provider does either of the following authentication:

 - Direct user authentication. For example, validating a user name and password.
 - Indirect user authentication. For example, validating an assertion about the user identity as presented by a separate identity provider.
 
The identity provider handles the management of user identities to free the service provider from this responsibility.

**Information required to get a token from different access identity providers**

 - Identity providers issue third-party access tokens after users authenticate with that provider. The contents of third-party access tokens will vary depending on the issuing identity provider. Because tokens are created and managed by a third-party (such as Facebook, GitHub, etc.), the validity period for third-party tokens will vary by the issuer.
 
 - The application receives an access token after a user successfully authenticates and authorizes access, then passes the access token as a credential when it calls the target API. The passed token informs the API that the bearer of the token has been authorized to access the API and perform specific actions specified by the scope that was granted during authorization
 
**Request for access token**

To request an access token, make a POST call to the  [token url](https://auth0.com/docs/api/authentication#authorization-code-flow-with-pkce45)
 
 curl -- request POST \
   -- url 'https://DOMAIN/oauth/token' \
   -- header 'content-type: application/x-www-form-urlencoded' \
   -- data grant_type=client_credentials \
   -- data client_id=YOUR_CLIENT_ID \
   -- data client_secret=YOUR_CLIENT_SECRET \
   -- data audience=YOUR_API_IDENTIFIER
   
**Parameter description**

 - grant_type: Set this to "client_credentials".

 - client_id: Application's Client ID.This can found on the [application's settings tab](https://manage.auth0.com/#/applications)
 
 - client_secret: Application's Client Secret.This can be found on the [application's settings tab](https://manage.auth0.com/#/applications)
 
 - audience: The audience for the token, which is the API. This can be found on the Identifier field of the [API's settings tab](https://manage.auth0.com/#/apis)
 
**Response**

An HTTP 200 response with a payload containing access_token, token_type, and expires_in values:

```
{
  "access_token":"eyJz93a...k4laUWw",
  "token_type":"Bearer",
  "expires_in":86400
}

```

When a user authenticates, it requests an access token and include the target audience and scope of access in the request. The application uses the /authorize endpoint to request access. This access is both requested by the application and granted by the user during authentication.

**Pass Parameters to Identity Providers**

 - Only valid OAuth 2.0/OIDC parameters are accepted.

 - Not all Identity Providers support upstream parameters. Check with the specific Identity Provider before you proceed with your implementation.

 - SAML identity providers, in particular, do not support upstream parameters.

Fields available for the [enum](https://auth0.com/docs/authenticate/identity-providers/pass-parameters-to-idps) parameter can be found here
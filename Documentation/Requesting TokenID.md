# Requesting TokenID

Depending on how the TokenID and Access Token are returned to the Client, there are three paths for Authentication:
+ [Authorization Code Flow](https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowAuth)
+ [Client Credentials Grant](https://www.oauth.com/oauth2-servers/access-tokens/client-credentials/)
+ [Password Grant](https://www.oauth.com/oauth2-servers/access-tokens/password-grant/)


## Authorization Code Flow


###  1. Authorization Code Request

This step  include  the following processes:

-   Authenticating the user
    
-   Redirecting the user to an Identity Provider to handle authentication
    
-   Checking for active Single Sign-on (SSO) sessions
    
-   Obtaining user consent for the requested permission level, unless consent has been previously given.
An Authentication Request is an OAuth 2.0 Authorization Request that requests that the End-User be authenticated by the [Authorization Server](https://auth0.auth0.com/u/login/identifier?state=hKFo2SBDdVBzdXMxbXVlcmEzd0M2ZDJrYlR3cHU4b055LTNSeaFur3VuaXZlcnNhbC1sb2dpbqN0aWTZIDVtdExtMzZ2TXF6a1VDREhmLWx5c0RBYjkyUnI1d3pOo2NpZNkgekVZZnBvRnpVTUV6aWxoa0hpbGNXb05rckZmSjNoQUk#/applications). In the first step the user is redirected to the given  url , the user will be authenticated and then redirected back to the client site with an authorization code. 

OpenID Connect uses the following OAuth 2.0 request parameters with the Authorization Code Flow:

>https://YOUR_DOMAIN/authorize?   
> 
>response_type=code&
> 
>client_id=YOUR_CLIENT_ID& 
>
>redirect_uri=https://YOUR_APP/callback&
> 
>scope=SCOPE& 
>
>state=STATE

-	`scope` (required) Selected scope separated by a space.
-	`response_type` (required)  Denotes the kind of credential that Auth0 will return (`code` or `token`). For this flow, the value must be **code**. 
-	`client_id`(required)   
Your application's Client ID. You can find this value in your  [Application Settings](https://manage.auth0.com/#/Applications/YOUR_CLIENT_ID/settings).
-	`redirect_uri`(required) 	The URL to which Auth0 will redirect the browser after authorization has been granted by the user. The Authorization Code will be available in the code URL parameter. You must specify this URL as a valid callback URL in your [Application Settings](https://__auth0_manage_url__/#/Applications/__AUTH0_CLIENT_ID__/settings).
-	`state`(recommended) A random string that is returned on success and can be used to verify the call and protect against cross site scripting attacks.

If the request is valid and  the Authorization Server attempts to Authenticate the End-User or determines whether the End-User is authenticated, the response would look like as the example below:

>	HTTP/1.1 302 Found 
	Location: https://YOUR_APP/callback?
	code=AUTHORIZATION_CODE&
	state=xyzABC123



### 1.2. TokenID Request

In this step the Authorization Code that was returned in step 1 will be exchanged with the Token Endpoint using the  grant_type  value  authorization_code for a token set containing Access, Refresh and ID Tokens.
The Client sends the parameters to the Token Endpoint using the HTTP  POST  method and the Form Serialization.


>    curl
>--request POST \ 
>	--url 'https://YOUR_DOMAIN/oauth/token' \ 
>	--header 'content-type: application/x-www-form-urlencoded' \ 
>	--data grant_type=authorization_code \ 
	--data 'client_id=YOUR_CLIENT_ID' \ 
	--data client_secret=YOUR_CLIENT_SECRET \ 
	--data code=YOUR_AUTHORIZATION_CODE \ 
	--data 'redirect_uri=https://YOUR_APP/callback'

The parameters in the TokenID Request are as following:

`grant_type`: Set this to  `authorization_code`.

`code`: The  `authorization_code`  retrieved in the previous step.

`client_id`: The application's Client ID which could be found in  [Application Settings](https://manage.auth0.com/#/Applications/YOUR_CLIENT_ID/settings).

`client_secret`: TThe Application's Client Secret which could be found in  [Application Settings](https://manage.auth0.com/#/Applications/YOUR_CLIENT_ID/settings).

`redirect_uri`The valid callback URL set in your Application settings. This must exactly match the  *redirect_uri*  passed to the authorization URL in the previous step of this tutorial. Note that this must be URL encoded.

Response example (success)

>
>   {
    "access_token" : "eyJhbGciOiJSUzI1NiJ9.eyJ2ZXIiOjEsImlzcyI6Imh0dHA6Ly9yYWluLm9rdGExLmNvbToxODAyIiwiaWF0IjoxNDQ5Nj
                      I0MDI2LCJleHAiOjE0NDk2Mjc2MjYsImp0aSI6IlVmU0lURzZCVVNfdHA3N21BTjJxIiwic2NvcGVzIjpbIm9wZW5pZCIsI
                      mVtYWlsIl0sImNsaWVudF9pZCI6InVBYXVub2ZXa2FESnh1a0NGZUJ4IiwidXNlcl9pZCI6IjAwdWlkNEJ4WHc2STZUVjRt
                      MGczIn0.HaBu5oQxdVCIvea88HPgr2O5evqZlCT4UXH4UKhJnZ5px-ArNRqwhxXWhHJisslswjPpMkx1IgrudQIjzGYbtLF
                      jrrg2ueiU5-YfmKuJuD6O2yPWGTsV7X6i7ABT6P-t8PRz_RNbk-U1GXWIEkNnEWbPqYDAm_Ofh7iW0Y8WDA5ez1jbtMvd-o
                      XMvJLctRiACrTMLJQ2e5HkbUFxgXQ_rFPNHJbNSUBDLqdi2rg_ND64DLRlXRY7hupNsvWGo0gF4WEUk8IZeaLjKw8UoIs-E
                      TEwJlAMcvkhoVVOsN5dPAaEKvbyvPC1hUGXb4uuThlwdD3ECJrtwgKqLqcWonNtiw",
    "token_type" : "Bearer",
    "expires_in" : 3600,
    "scope"      : "openid email",
    "refresh_token" : "a9VpZDRCeFh3Nkk2VdY",
    "id_token" : "eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwMHVpZDRCeFh3Nkk2VFY0bTBnMyIsImVtYWlsIjoid2VibWFzdGVyQGNsb3VkaXR1ZG
                  UubmV0IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInZlciI6MSwiaXNzIjoiaHR0cDovL3JhaW4ub2t0YTEuY29tOjE4MDIiLCJsb
                  2dpbiI6ImFkbWluaXN0cmF0b3IxQGNsb3VkaXR1ZGUubmV0IiwiYXVkIjoidUFhdW5vZldrYURKeHVrQ0ZlQngiLCJpYXQiOjE0
                  NDk2MjQwMjYsImV4cCI6MTQ0OTYyNzYyNiwiYW1yIjpbInB3ZCJdLCJqdGkiOiI0ZUFXSk9DTUIzU1g4WGV3RGZWUiIsImF1dGh
                  fdGltZSI6MTQ0OTYyNDAyNiwiYXRfaGFzaCI6ImNwcUtmZFFBNWVIODkxRmY1b0pyX1EifQ.Btw6bUbZhRa89DsBb8KmL9rfhku
                  --_mbNC2pgC8yu8obJnwO12nFBepui9KzbpJhGM91PqJwi_AylE6rp-ehamfnUAO4JL14PkemF45Pn3u_6KKwxJnxcWxLvMuuis
                  nvIs7NScKpOAab6ayZU0VL8W6XAijQmnYTtMWQfSuaaR8rYOaWHrffh3OypvDdrQuYacbkT0csxdrayXfBG3UF5-ZAlhfch1fhF
                  T3yZFdWwzkSDc0BGygfiFyNhCezfyT454wbciSZgrA9ROeHkfPCaX7KCFO8GgQEkGRoQntFBNjluFhNLJIUkEFovEDlfuB4tv_M
                  8BM75celdy3jkpOurg"
    }


Response example (error)
>
>HTTP 401 Unauthorized
Content-Type: application/json;charset=UTF-8
{
    "error" : "invalid_client",
    "error_description" : "No client credentials found."
}



Ultimately, the retrieved Access Token is passed as a Bearer token in the Authorization header of the HTTP request.
>
>	{
>    "access_token": "eyJz93a...k4laUWw",
>    "refresh_token": "GEbRxBN...edjnXbL",
>	 "id_token": "eyJ0XAi...4faeEoQ",
>	 "token_type": "Bearer"
>	 }

### 1.3. API Call
For calling the API, the application passes the retrieved access token as a Bearer token which is found in the header of the HTTP request.
>
>	  curl 
>	  --request GET \ --url https://"SealsystemAPI".com/api \ 
>	  --header 'authorization: Bearer 	ACCESS_TOKEN' \ 
>	  --header 'content-type: application/json'


### 1.4. Refresh Token
This token is used to get a new access token, quite short after the previous access token is expired. To refresh the token a `Post` request to the endpoint authentication containing the `grant_type=refresh_token` is made. 
An instance for the Refresh Token request:
>
>	curl 
>	--request POST \ 
>	--url 'https://YOUR_DOMAIN/oauth/token' \ 
>	--header 'content-type: application/x-www-form-urlencoded' \ 
>	--data grant_type=refresh_token \ 
>	--data 'client_id=YOUR_CLIENT_ID' \ 
>	--data 	refresh_token=YOUR_REFRESH_TOKEN

The parameters being used are as following:

`grant_type` : is set to `refresh_token`.

`client_id` : The Application's Client ID which could be found in  [Application Settings](https://__auth0_manage_url__/#/Applications/__AUTH0_CLIENT_ID__/settings).

`refresh_token` : The refresh token to use.

`scope` : (optional) A space-delimited list of requested scope permissions. If not sent, the original scopes will be used; otherwise you can request a reduced set of scopes. Note that this must be URL encoded.


## Client Credentials Grant
Initially a request token should be placed from the authorized application. The example code below shows crucial parameters to be posted:

>	curl
>	--request POST \ 
	--url 'https://YOUR_DOMAIN/oauth/token' \ 
	--header 'content-type: application/x-www-form-urlencoded' \ 
	--data grant_type=client_credentials \ --data client_id=YOUR_CLIENT_ID \ 
	--data client_secret=YOUR_CLIENT_SECRET \ 
	--data audience=YOUR_API_IDENTIFIER

The `POST` parameters in this request are explained below.
-	`grant_type` : (required) The  `grant_type`  parameter must be set to  *client_credentials*.
-	`scope` :  (optional) Different scopes for the client credentials grant can be supported by the service
-	*Client Authentication* (required) : The client needs to authenticate themselves for this request. Typically the service will allow either additional request parameters  `client_id`  and  `client_secret`, or accept the client ID and secret in the HTTP Basic auth header. They could be found on the [application's setting s tab](https://manage.auth0.com/?_ga=2.243378373.1141517786.1652538501-897533596.1651679864&_gac=1.183489876.1652372090.Cj0KCQjw4PKTBhD8ARIsAHChzRIRJeWrbtecf70LMyVTLX93rxtvFx75Fe2M5M0I0y2JylDvurNyxnkaAkeAEALw_wcB&_gl=1*19ggfex*rollup_ga*ODk3NTMzNTk2LjE2NTE2Nzk4NjQ.*rollup_ga_F1G3E656YZ*MTY1MjU1MzAzNy4xNS4xLjE2NTI1NTM4NTIuNjA.#/applications)
-	`audience`
The audience for the token, which is your API. You can find this in the  **Identifier**  field on your  [API's settings tab](https://manage.auth0.com/#/apis).
-	`Resource` (optional) : To create customized Access Token for authorizing access to APIs and API gateways, the Resource could be specified.
The response in a successful request would be similar to the below response:

>
>	{ 
	"access_token":"eyJz93a...k4laUWw",
	"token_type":"Bearer",
	"expires_in":86400
	}

Ultimately, the retrieved Access Token is passed as a Bearer token in the Authorization header of the HTTP request.

>	
>	curl 
>	--request GET \
	 --url https://"SealsystemAPI".com/api \ 
	 --header 'authorization: Bearer ACCESS_TOKEN' \ 
	 --header 'content-type: application/json'

##  Password Grant
After locating the **Default Directory** in  [Tenant Settings](https://manage.auth0.com/?_ga=2.209824341.1141517786.1652538501-897533596.1651679864&_gac=1.263199102.1652372090.Cj0KCQjw4PKTBhD8ARIsAHChzRIRJeWrbtecf70LMyVTLX93rxtvFx75Fe2M5M0I0y2JylDvurNyxnkaAkeAEALw_wcB&_gl=1*xdj8jr*rollup_ga*ODk3NTMzNTk2LjE2NTE2Nzk4NjQ.*rollup_ga_F1G3E656YZ*MTY1MjU0NjI1Ny4xNC4xLjE2NTI1NDc5NTEuNjA.#/tenant), the name of the desired directory should be entered.
For this method the *grant_type* is set to **password** and the values for *username*, *password* are required to be entered by the user. Any *scope* could be also defined by the application, however this is not mandatory. 
To get the user credentials the given interactive form with should be posted to the token URL.
>
>	curl 
>	--request POST \ --url 
	--https://YOUR_DOMAIN/oauth/token' \
	--header 'content-type: application/x-www-form-urlencoded' \ 
	--data grant_type=password \ 
	--data username=user@example.com \ 
	--data password=pwd \ --data audience=YOUR_API_IDENTIFIER \ 
	--data scope=read:sample \ 
	--data 'client_id=YOUR_CLIENT_ID' \ 
	--data client_secret=YOUR_CLIENT_SECRET

The `POST` parameters in this request are explained below.

-   `grant_type=password` :  This tells the server we’re using the Password grant type and is set to *password*
-   `username` :  The user’s username that they entered in the application
-   `password` :  The user’s password that they entered in the application
-   `client_id` : The application's Client ID which could be found in [Application Settings](https://manage.auth0.com/?_ga=2.247177796.1141517786.1652538501-897533596.1651679864&_gac=1.119069179.1652372090.Cj0KCQjw4PKTBhD8ARIsAHChzRIRJeWrbtecf70LMyVTLX93rxtvFx75Fe2M5M0I0y2JylDvurNyxnkaAkeAEALw_wcB&_gl=1*19p1ho4*rollup_ga*ODk3NTMzNTk2LjE2NTE2Nzk4NjQ.*rollup_ga_F1G3E656YZ*MTY1MjU1MzAzNy4xNS4wLjE2NTI1NTMwNDAuNTc.#/Applications/YOUR_CLIENT_ID/settings). 
-   `client_secret` :  (optional) - If the application is a “confidential client” (not a mobile or JavaScript app), then the secret is included as well.
-   `scope` :  (optional) - If the application is requesting a token with limited scope, it should provide the requested scopes here.
- 	`Resource` (optional) When the *API Authorization* is configured, specify the API Resource Identifier here to generate a customized Access Token that can be used for authorizing access to apis and api gateway

The server replies with an access token in the same format as the other grant types in case of successful process.

>
>	{ "access_token": "eyJz93a...k4laUWw", 
	"refresh_token": "GEbRxBN...edjnXbL", 
	"id_token": "eyJ5ZAi...4faeEoQ", 
	"token_type": "Bearer", 
	"expires_in": 36000 
	}

Ultimately, the retrieved Access Token is passed as a Bearer token in the Authorization header of the HTTP request.

>	curl 
>	--request GET \
>	 --url https://"SealsystemAPI".com/api \ 
	 --header 'authorization: Bearer ACCESS_TOKEN' \ 
	 --header 'content-type: application/json'


## Libraries
#### [node openid-client](https://www.npmjs.com/package/openid-client)

-   **openid-client is a Relying Party(RP) implementation for node.js servers. Wide feature coverage including optional specifications such as ID Token and UserInfo claim encryption support, JWT Client Authz and more make it the go to library for node.js clients. Passport.js strategy is included.**
-   _Target Environment:_  JavaScript for node.js
-   _License:_  MIT
-   _Certified By:_  Filip Skokan
-   _Conformance Profiles:_  Basic RP, Implicit RP, Hybrid RP, Config RP, Dynamic RP, Form Post RP


#### Useful resources:
[OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
[Okta Developer](https://developer.okta.com/docs/reference/api/oidc/#response-example-error-2)
[Grant Types](https://identityserver4.readthedocs.io/en/aspnetcore2/topics/grant_types.html)
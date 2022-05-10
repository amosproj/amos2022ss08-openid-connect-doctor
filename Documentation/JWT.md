## JWT Decryption

1. Initially, the JWT needs to be checked whether it has at least one period (‘.’) character in it.
2. The part of the JWT which appears prior to the first period is the encoded JOSE header, which needs to be base64url decoded assuming that there are no line breaks, whitespaces, or other additional characters are used. Plus, verify that the resulting octet sequence is a UTF-8 encoded representation of a completely valid JSON object conforming to RFC7519.
       • 	Furthermore, the resulting JOSE header needs to be verified to include only parameters and values whose syntax and 
        semantics are both understood and supported or are specified as being ignored if not understood.
3.	Next step is to check whether the JWT is a JWS (JSON Web Signature) or a JWE (JSON Web Encryption), which is described in the section Difference between JWE and JWS.
4.	Depending on what has been received, i.e., JWE or JWS, follow the below steps accordingly.
       •	If the JWT is a JWS, then the steps specified in the section 5.2 of JWS file need to be followed. Its corresponding 
        message is obtained by decoding the JWS payload.
             [JWS.pdf](https://github.com/amosproj/amos2022ss08-openid-connect-doctor/files/8660929/JWS.pdf)
       •	Else, if the JWT is a JWE, then the steps specified in the section 5.2 of JWE file need to be followed. Let the message 
        be the resulting plaintext.
             [JWE.pdf](https://github.com/amosproj/amos2022ss08-openid-connect-doctor/files/8660928/JWE.pdf)
5.	If the JOSE header has a “cty” (content type) value of “JWT”, then the message is a JWT that was subjected to nested signing or encryption operations. Thenceforth, return to step 1, using the message as the JWT.
6.	If not, the message needs to be base64url decoded with the assumption that no line breaks, whitespace, or other additional characters are used. Additionally, the resulting octet sequence needs to be verified that it is a UTF-8 encoded representation of a completely valid JSON object conforming to RFC7519.

Finally, it should be noted that which algorithms may be used in a given context is an application decision. Even if a JWT is successfully validated, unless the algorithms used in the JWT are acceptable in the application, the JWT should be rejected.

### Difference between JWE and JWS
The many methods to distinguish a JWE from a JWS are listed below. As a matter of fact, every method would result in the same output for all legal input values; they may produce different results for illegal inputs.
•	If the object is using the JWS Compact Serialisation or the JWE Compact Serialisation, the number base64url-encoded segments that are separated by a period character are three and five respectively.
•	If the object is using the JWS JSON Serialisation or the JWE JSON Serialisation, JWS will have a payload member and JWE will not, whereas JWE will have a “ciphertext” and JWS will not.
•	There is a stark difference between the JOSE header for a JWS and that for a JWE, which can be concluded by examining the “alg” (algorithm) header parameter value. If the value represents a digital signature or MAC algorithm, or a value “none”, then it is for JWS; if it represents a key encryption, key wrapping, direct key agreement, key agreement with key wrapping, or direct encryption algorithm, then it is for a JWE. This is very straightforward if working with compact serialisations of the JWS or the JWE, whereas maybe a little difficult when using JSON serialisation of the JWS or the JWE.
•	If “enc” (encryption algorithm) member exists in the JOSE header, it is a JWE; otherwise, a JWS.

Also, uploading the JWT file for full reference, if required.
[JWT.pdf](https://github.com/amosproj/amos2022ss08-openid-connect-doctor/files/8660942/JWT.pdf)

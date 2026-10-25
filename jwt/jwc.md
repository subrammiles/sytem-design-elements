What does a JWT look like?
A JWT typically looks like this:
xxxxx.yyyyy.zzzzz

It has three parts separated by dots:
HEADER.PAYLOAD.SIGNATURE


Token:

Generated JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDEiLCJlbWFpbCI6InN1YnJhbUBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzkyOTA1MjEzLCJleHAiOjE3OTI5MDYxMTN9.nJoEb2WcB2AYyiUXhdeSw23ce2RKRMfUDy-KG5-1veI



#

                     Client
                        |
                        | Login with credentials
                        v
                   Auth Service
                        |
                        | Generate JWT
                        v
                      Client
                        |
                 Sends JWT with request
                        |
                        v
                  API Gateway
                        |
               Validate JWT signature
                        |
               +--------+--------+
               |                 |
               v                 v
          UserService        OrderService
                                  |
                                  v
                            PaymentService
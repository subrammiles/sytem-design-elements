First, understand the problem OAuth 2.0 solves
Imagine you're building a meditation app with two services:
- User Service — manages user profiles.
- Meditation Service — provides meditation sessions.
You want users to access their profiles securely.

One approach is to give each application the user's password. But that creates a security problem: applications shouldn't need to share passwords with one another.

OAuth 2.0 provides a way for a client application to obtain limited access to protected resources using an access token.


Service-to-service authorization
We'll begin with the OAuth 2.0 Client Credentials flow because it's one of the easiest flows to understand and implement.

Imagine your meditation platform has a background service that needs to access another service.
                  Meditation Worker
                         |
                         | 1. Request access token
                         v
                  Authorization Server
                      (Keycloak)
                         |
                         | 2. Return access token
                         v
                  Meditation Worker
                         |
                         | 3. Call API with token
                         v
                    User Service
                         |
                         | 4. Validate token
                         v
                    Return data


Here, the worker is acting on its own behalf, not on behalf of a logged-in user. This is exactly the kind of situation the Client Credentials flow is designed for.

#
docker run -d \
  --name keycloak \
  -p 127.0.0.1:8080:8080 \
  -e KC_BOOTSTRAP_ADMIN_USERNAME=admin \
  -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin123 \
  quay.io/keycloak/keycloak:latest \
  start-dev

  Open the administration console:

Keycloak Administration Console
http://localhost:8080/admin/

#

Create a realm and client
In the Keycloak administration console:

A. Create a realm
1. Open the realm selector.
2. Choose Create realm.
3. Name it meditation.
A realm is a space for managing applications, users, and security settings.

B. Create a client
1. Open Clients.
2. Select Create client.
3. Choose the OpenID Connect protocol.
4. Set the client ID to meditation-worker.
5. Save the client.


C. Configure the client

For this exercise, configure it as a confidential client and enable Service accounts roles. Save the configuration and obtain the generated client secret from the client's credentials section.

The client ID identifies the application; the client secret proves its identity to Keycloak.

Keep the secret private. Never put it in frontend JavaScript or a mobile app.

Keycloak's documentation explains these client settings and the service-account configuration.


#.env
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=meditation
CLIENT_ID=meditation-worker
CLIENT_SECRET=PASTE_YOUR_CLIENT_SECRET_HERE

#
Run
node token.js

What happened here?
This is the key OAuth 2.0 request:
grant_type: "client_credentials"

It tells Keycloak:
"I am an application, not a user logging in. Authenticate my client credentials and issue an access token if I'm authorized."

The response typically contains:
{
  "access_token": "<token-value>",
  "expires_in": 300,
  "token_type": "Bearer"
}

The actual expiration time depends on your Keycloak configuration.

Notice something important: we didn't create the token using jwt.sign() ourselves. Keycloak issued it after validating the client's credentials.
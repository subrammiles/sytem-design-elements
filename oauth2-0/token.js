require("dotenv").config();
const axios = require("axios");

async function getAccessToken() {
  const tokenUrl =
    `${process.env.KEYCLOAK_URL}/realms/` +
    `${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const response = await axios.post(
    tokenUrl,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  console.log("Access token:", response.data.access_token);
  console.log("Token type:", response.data.token_type);
  console.log("Expires in:", response.data.expires_in, "seconds");

  return response.data.access_token;
}

getAccessToken().catch((error) => {
  console.error(
    "Token request failed:",
    error.response?.data || error.message
  );
});
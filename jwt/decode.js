/* When you execute it, jwt.sign() generates a signed JWT and stores it in the token variable. */

const jwt = require("jsonwebtoken");

const JWT_SECRET = "demo-secret-change-me";



const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMDEiLCJlbWFpbCI6InN1YnJhbUBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzkyOTA1MjEzLCJleHAiOjE3OTI5MDYxMTN9.nJoEb2WcB2AYyiUXhdeSw23ce2RKRMfUDy-KG5-1veI"

const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

console.log("Decoded JWT:", decoded);

 





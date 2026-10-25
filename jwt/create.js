/* When you execute it, jwt.sign() generates a signed JWT and stores it in the token variable. */

const jwt = require("jsonwebtoken");

const JWT_SECRET = "demo-secret-change-me";

const user = {
  id: "101",
  email: "subram@example.com",
  password: "mypassword123",
  role: "user",
};

const token = jwt.sign(
  {
    userId: user.id,
    email: user.email,
    role: user.role,
  },
  JWT_SECRET,
  {
    algorithm: "HS256",
    expiresIn: "15m",
  }
);

console.log("Generated JWT:", token);

 





const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

// Demo secret: use a strong secret from environment variables
// in real applications.
const JWT_SECRET = process.env.JWT_SECRET || "demo-secret-change-me";

// Demo user. In a real application, retrieve users from a database
// and verify a securely hashed password.
const user = {
  id: "101",
  email: "subram@example.com",
  password: "mypassword123",
  role: "user",
};

// 1. LOGIN: Verify credentials and generate a JWT.
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== user.email || password !== user.password) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  // Create a token containing user information.
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

  res.json({
    message: "Login successful",
    token,
  });
});

// 2. AUTHENTICATION MIDDLEWARE: Verify the JWT.
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access token required",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Attach the verified claims to the request.
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}

// 3. PROTECTED API: Requires a valid JWT.
app.get("/profile", authenticateToken, (req, res) => {
  res.json({
    message: "Welcome! You are authenticated.",
    user: {
      id: req.user.userId,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

// Start the server.
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
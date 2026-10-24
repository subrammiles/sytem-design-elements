const express = require("express");

const app = express();

app.use(async (req, res) => {
  try {
    // Forward the request to Payment Service.
    const targetUrl =
      `http://localhost:3002${req.originalUrl}`;

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "content-type":
          req.headers["content-type"] || "application/json"
      }
    });

    const data = await response.text();

    res.status(response.status).send(data);

  } catch (error) {
    res.status(502).json({
      error: "Payment Service is unavailable"
    });
  }
});

app.listen(4000, () => {
  console.log("Proxy running on port 4000");
});
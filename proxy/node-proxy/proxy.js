const express = require("express");

const app = express();

const PAYMENT_SERVICE_URL = "http://localhost:3002";

// Headers that should not be forwarded hop-by-hop
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host"
]);

// Read the incoming request body as raw bytes
async function readRequestBody(req) {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

// Forward requests to the Payment Service
app.use(async (req, res) => {
  try {
    // Preserve the original path and query parameters
    const targetUrl =
      `${PAYMENT_SERVICE_URL}${req.originalUrl}`;

    console.log(`${req.method} ${req.originalUrl} -> ${targetUrl}`);

    // Copy relevant request headers
    const headers = {};

    for (const [name, value] of Object.entries(req.headers)) {
      if (
        value !== undefined &&
        !HOP_BY_HOP_HEADERS.has(name.toLowerCase()) &&
        name.toLowerCase() !== "content-length"
      ) {
        headers[name] = value;
      }
    }

    // Read the body for methods that can carry one
    const body = ["GET", "HEAD"].includes(req.method)
      ? undefined
      : await readRequestBody(req);

    // Forward the request
    const upstreamResponse = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body && body.length > 0 ? body : undefined,
      signal: AbortSignal.timeout(10000)
    });

    // Copy relevant response headers
    for (const [name, value] of upstreamResponse.headers) {
      const lowerName = name.toLowerCase();

      if (
        !HOP_BY_HOP_HEADERS.has(lowerName) &&
        ![
          "content-length",
          "content-encoding"
        ].includes(lowerName)
      ) {
        res.setHeader(name, value);
      }
    }

    // Preserve the upstream HTTP status code
    res.status(upstreamResponse.status);

    // Relay the response body
    if (req.method === "HEAD" || upstreamResponse.status === 204 ||
        upstreamResponse.status === 304) {
      return res.end();
    }

    const responseBody = Buffer.from(
      await upstreamResponse.arrayBuffer()
    );

    res.send(responseBody);

  } catch (error) {
    console.error("Proxy error:", error.message);

    if (res.headersSent) {
      return res.destroy();
    }

    const isTimeout = error.name === "TimeoutError";

    res.status(isTimeout ? 504 : 502).json({
      error: isTimeout
        ? "Payment Service request timed out"
        : "Payment Service is unavailable"
    });
  }
});

app.listen(4000, () => {
  console.log("Proxy running at http://localhost:4000");
});


# Paymenyt service

Implement the Payment Service
t provides three payment endpoints:
HTTPmethod	    Endpoint	                  Purpose
GET	          /payments	         Retrieve all payments
GET 	      /payments/1	     Retrieve payment with ID 1
POST	      /payments	         Create a payment


The data is stored in memory, so it resets when you restart the service. This is for learning, not actual payment processing.

# Proxy
This version forwards the HTTP method, URL path, query string, request body, and relevant headers. It also relays the upstream status code and response headers, with a basic timeout.

It is still a learning example, not a fully production-ready general-purpose proxy. For example, it doesn't implement streaming responses, WebSockets, or sophisticated connection handling.

# 
Run both applications
You need two terminal windows.

Terminal 1 — Start the Payment Service
node payment-service.js

Expected output:
Payment Service running at http://localhost:3002

Terminal 2 — Start the Proxy
node proxy.js

Expected output:
Proxy running at http://localhost:4000

Both applications are now running.


# testing
Test the proxy
You can use curl from your Ubuntu terminal. You don't need Postman.
Test 1: Check the Payment Service through the proxy
curl http://localhost:4000/health

Expected response:
{
  "service": "Payment Service",
  "status": "UP"
}

The request follows this path:
curl
 |
 | GET /health
 v
Proxy :4000
 |
 | GET /health
 v
Payment Service :3002
 |
 | Returns JSON
 v
Proxy :4000
 |
 v
curl

Notice that the client connects to port 4000, not 3002.
Test 2: Retrieve all payments
curl http://localhost:4000/payments

Expected response:
{
  "service": "Payment Service",
  "count": 2,
  "payments": [
    {
      "id": 1,
      "userId": 101,
      "amount": 500,
      "currency": "INR",
      "status": "SUCCESS"
    },
    {
      "id": 2,
      "userId": 102,
      "amount": 1200,
      "currency": "INR",
      "status": "PENDING"
    }
  ]
}

Test 3: Retrieve a specific payment
curl http://localhost:4000/payments/1

Expected response:
{
  "id": 1,
  "userId": 101,
  "amount": 500,
  "currency": "INR",
  "status": "SUCCESS"
}

Test 4: Create a payment using POST
Run:
curl -X POST http://localhost:4000/payments \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 103,
    "amount": 2500,
    "currency": "INR"
  }'

Expected response with HTTP status 201 Created:
{
  "message": "Payment created successfully",
  "payment": {
    "id": 3,
    "userId": 103,
    "amount": 2500,
    "currency": "INR",
    "status": "PENDING"
  }
}

The proxy forwards the POST request body to the Payment Service, which creates the payment and returns the result.
Test 5: Verify that the proxy forwards errors
curl -i http://localhost:4000/payments/999

The Payment Service returns 404 Not Found because payment 999 doesn't exist.

The proxy preserves that status code and forwards the response to the client.

Important: For these tests, use localhost:4000 as the client-facing endpoint. The proxy will forward requests to port 3002.
7. What happens if the Payment Service goes down?
Stop the Payment Service by pressing Ctrl+C in Terminal 1.

Now execute:
curl -i http://localhost:4000/payments

The proxy will attempt to contact the Payment Service, fail to connect, and return a 502 Bad Gateway response.

Example:
{
  "error": "Payment Service is unavailable"
}

This demonstrates one useful role of a proxy: it can provide a consistent entry point and return controlled errors when an upstream service is unavailable.

A production proxy may also implement health checks, load balancing, authentication, metrics, and other features.
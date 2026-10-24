const express = require("express");

const app = express();

app.use(express.json());

// Sample in-memory payment data
const payments = [
  {
    id: 1,
    userId: 101,
    amount: 500,
    currency: "INR",
    status: "SUCCESS"
  },
  {
    id: 2,
    userId: 102,
    amount: 1200,
    currency: "INR",
    status: "PENDING"
  }
];

// Health check
app.get("/health", (req, res) => {
  res.json({
    service: "Payment Service",
    status: "UP"
  });
});

// Get all payments
app.get("/payments", (req, res) => {
  res.json({
    service: "Payment Service",
    count: payments.length,
    payments
  });
});

// Get a payment by ID
app.get("/payments/:id", (req, res) => {
  const payment = payments.find(
    p => p.id === Number(req.params.id)
  );

  if (!payment) {
    return res.status(404).json({
      error: "Payment not found"
    });
  }

  res.json(payment);
});

// Create a payment
app.post("/payments", (req, res) => {
  const { userId, amount, currency = "INR" } = req.body;

  if (
    userId == null ||
    !Number.isFinite(Number(amount)) ||
    Number(amount) <= 0
  ) {
    return res.status(400).json({
      error: "Valid userId and positive amount are required"
    });
  }

  const payment = {
    id: payments.length
      ? Math.max(...payments.map(p => p.id)) + 1
      : 1,
    userId,
    amount: Number(amount),
    currency,
    status: "PENDING"
  };

  payments.push(payment);

  res.status(201).json({
    message: "Payment created successfully",
    payment
  });
});

app.listen(3002, () => {
  console.log("Payment Service running at http://localhost:3002");
});
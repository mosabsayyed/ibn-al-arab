import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleDeliveryCheck } from "./routes/delivery";
import { handleStudentValidate } from "./routes/student";
import { handleCheckout } from "./routes/payment";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // App routes
  app.post("/api/check-delivery", handleDeliveryCheck);
  app.post("/api/validate-student", handleStudentValidate);
  app.post("/api/payment/checkout", handleCheckout);

  return app;
}

import { RequestHandler } from "express";
import { DeliveryCheckRequest, DeliveryCheckResponse } from "@shared/api";

// Simple Sharjah-only eligibility check (case-insensitive, trims spaces)
export const handleDeliveryCheck: RequestHandler = (req, res) => {
  const body = req.body as Partial<DeliveryCheckRequest>;
  const city = (body.city ?? "").toString().trim().toLowerCase();

  const eligible = city === "sharjah" || city === "sharjah, ae" || city === "shj";

  const response: DeliveryCheckResponse = {
    eligible,
    region: "Sharjah",
    message: eligible
      ? "We deliver in Sharjah. You're good to go!"
      : "Currently we only deliver within Sharjah.",
  };
  res.status(200).json(response);
};

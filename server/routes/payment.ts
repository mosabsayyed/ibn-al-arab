import { RequestHandler } from "express";
import { CheckoutRequest, CheckoutResponse } from "@shared/api";

export const handleCheckout: RequestHandler = (req, res) => {
  const body = req.body as Partial<CheckoutRequest>;
  const planId = body.planId;

  if (!planId) {
    const bad: CheckoutResponse = { success: false, message: "Missing planId" };
    return res.status(400).json(bad);
  }

  const url = `https://example-payments.test/checkout?plan=${encodeURIComponent(
    planId,
  )}`;

  const ok: CheckoutResponse = {
    success: true,
    checkoutUrl: url,
    message: "Redirecting to secure checkout...",
  };
  res.status(200).json(ok);
};

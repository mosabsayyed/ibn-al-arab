/**
 * Shared types between client and server
 */

// Demo
export interface DemoResponse {
  message: string;
}

// Delivery Zone Checker
export interface DeliveryCheckRequest {
  city: string;
}
export interface DeliveryCheckResponse {
  eligible: boolean;
  region: string;
  message: string;
}

// Student Discount Validation
export interface StudentValidateRequest {
  email: string;
  expiryISO: string; // ISO date string
}
export interface StudentValidateResponse {
  valid: boolean;
  reason?: string;
  discountPercent?: number; // returned when valid
}

// Payment Gateway (stub)
export type PlanId = "flex" | "focus" | "fuel";

export interface CheckoutRequest {
  planId: PlanId;
  student?: {
    email: string;
    valid: boolean;
  } | null;
}

export interface CheckoutResponse {
  success: boolean;
  checkoutUrl?: string;
  message?: string;
}

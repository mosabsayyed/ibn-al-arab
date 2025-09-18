import { RequestHandler } from "express";
import { StudentValidateRequest, StudentValidateResponse } from "@shared/api";

// Very lightweight validation: email domain appears academic, and expiry date is in the future
const ACADEMIC_HINTS = [".edu", ".ac.ae", ".ac", "university", "college"];

export const handleStudentValidate: RequestHandler = (req, res) => {
  const body = req.body as Partial<StudentValidateRequest>;
  const email = (body.email ?? "").toString().trim().toLowerCase();
  const expiryISO = (body.expiryISO ?? "").toString();

  let valid = false;
  let reason: string | undefined;
  const date = new Date(expiryISO);

  if (!email || !expiryISO || isNaN(date.getTime())) {
    reason = "Missing or invalid email/expiry date.";
  } else {
    const domainLikelyAcademic = ACADEMIC_HINTS.some((h) => email.includes(h));
    const notExpired = date.getTime() > Date.now();
    valid = domainLikelyAcademic && notExpired;
    if (!domainLikelyAcademic) reason = "Email does not appear to be academic.";
    if (!notExpired) reason = "Student verification has expired.";
  }

  const response: StudentValidateResponse = valid
    ? { valid: true, discountPercent: 18.5 }
    : { valid: false, reason };

  res.status(200).json(response);
};

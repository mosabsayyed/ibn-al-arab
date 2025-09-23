-- Migration: create payments table used by backend
-- NOTE: This migration is compatible with Supabase/Postgres

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY,
  plan_id text NOT NULL,
  provider text NOT NULL,
  user_id uuid,
  status text NOT NULL DEFAULT 'pending',
  receipt_url text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_plan_id ON public.payments(plan_id);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS payments_touch_updated_at ON public.payments;
CREATE TRIGGER payments_touch_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE PROCEDURE public.touch_updated_at();

import React from 'react';
import { render, screen } from '@testing-library/react';
import MealPlanPreview from '../../../client/components/sections/MealPlanPreview';
import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock AuthContext
vi.mock('../../../client/context/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));

vi.mock('../../../client/context/i18n', () => ({
  useI18n: () => ({ t: (k: string) => k, locale: 'en' }),
}));

describe('MealPlanPreview CTA visibility', () => {
  beforeEach(() => {
    // Mock fetch to return a single plan so the component renders the CTA
    (global as any).fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [
          {
            id: 'plan_basic',
            name_en: 'Basic Plan',
            name_ar: 'الخطة الأساسية',
            delivery_days: 5,
            meals_per_day: 1,
            base_price_aed: 100,
            discounted_price_aed: null,
            code: 'Basic',
          },
        ],
      })
    );
  });

  test('shows login-to-subscribe link when unauthenticated', async () => {
    render(<MealPlanPreview />);
  const loginLink = await screen.findByRole('link', { name: /loginToSubscribe/i });
  expect(loginLink).toBeTruthy();
    // Ensure returnTo query exists in href
    expect(loginLink.getAttribute('href')).toContain('/login?returnTo=');
  });
});

import { describe, it, expect } from 'vitest'
import { Plan, validatePlan } from '../../../backend/src/models/plan'

describe('Plan model tests', () => {
  it('should validate a correct plan object', () => {
    const plan: Plan = {
      id: 'test-id',
      code: 'TEST',
      name_en: 'Test Plan',
      name_ar: 'خطة تجريبية',
      meals_per_day: 1,
      delivery_days: 30,
      duration_label: '1_month',
      base_price_aed: 100,
      discounted_price_aed: 90,
      position_note_en: 'Test note',
      position_note_ar: 'ملاحظة تجريبية',
      status: 'active',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(validatePlan(plan)).toBe(true)
  })

  it('should reject invalid plan missing required fields', () => {
    const invalidPlan = {
      id: 'test-id',
      // missing code
      name_en: 'Test Plan'
    }
    expect(() => validatePlan(invalidPlan)).toThrow('code required')
  })

  it('should reject invalid status', () => {
    const invalidPlan = {
      id: 'test-id',
      code: 'TEST',
      name_en: 'Test Plan',
      name_ar: 'خطة تجريبية',
      meals_per_day: 1,
      delivery_days: 30,
      duration_label: '1_month',
      base_price_aed: 100,
      discounted_price_aed: 90,
      position_note_en: 'Test note',
      position_note_ar: 'ملاحظة تجريبية',
      status: 'invalid' as any, // invalid status
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(() => validatePlan(invalidPlan)).toThrow('Invalid status')
  })
})
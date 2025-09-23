import { describe, it, expect } from 'vitest'

describe('GET /plans contract test', () => {
  it('should return 200 and plans matching schema', async () => {
    const res = await fetch('http://127.0.0.1:4101/api/plans')
    expect(res.status).toBe(200)
    const plans = await res.json()
    expect(Array.isArray(plans)).toBe(true)
    plans.forEach((plan: any) => {
      expect(plan).toHaveProperty('id')
      expect(plan).toHaveProperty('code')
      expect(plan).toHaveProperty('name_en')
      expect(plan).toHaveProperty('name_ar')
      expect(plan).toHaveProperty('meals_per_day')
      expect(plan).toHaveProperty('delivery_days')
      expect(plan).toHaveProperty('duration_label')
      expect(plan).toHaveProperty('base_price_aed')
      expect(plan).toHaveProperty('discounted_price_aed')
      expect(plan).toHaveProperty('position_note_en')
      expect(plan).toHaveProperty('position_note_ar')
      expect(plan).toHaveProperty('status')
      expect(plan).toHaveProperty('created_at')
      expect(plan).toHaveProperty('updated_at')
    })
  })
})
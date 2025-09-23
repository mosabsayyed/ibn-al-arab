import { describe, it, expect } from 'vitest'
import { Subscription, validateSubscription } from '../../../backend/src/models/subscription'

describe('Subscription model tests', () => {
  it('should validate a correct subscription object', () => {
    const subscription: Subscription = {
      id: 'test-id',
      user_id: 'user-id',
      plan_id: 'plan-id',
      status: 'pending',
      start_date: '2023-01-01',
      end_date: '2023-01-31',
      delivery_address_id: 'address-id',
      price_charged_aed: 100,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(validateSubscription(subscription)).toBe(true)
  })

  it('should reject invalid subscription missing required fields', () => {
    const invalidSubscription = {
      id: 'test-id',
      user_id: 'user-id',
      // missing plan_id
      status: 'pending' as const,
      start_date: '2023-01-01',
      end_date: '2023-01-31',
      delivery_address_id: 'address-id',
      price_charged_aed: 100,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(() => validateSubscription(invalidSubscription)).toThrow('plan_id required')
  })

  it('should reject invalid status', () => {
    const invalidSubscription = {
      id: 'test-id',
      user_id: 'user-id',
      plan_id: 'plan-id',
      status: 'invalid' as any, // invalid status
      start_date: '2023-01-01',
      end_date: '2023-01-31',
      delivery_address_id: 'address-id',
      price_charged_aed: 100,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(() => validateSubscription(invalidSubscription)).toThrow('Invalid status')
  })
})
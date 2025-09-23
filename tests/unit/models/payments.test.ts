import { describe, it, expect } from 'vitest'
import { Payment, validatePayment } from '../../../backend/src/models/payment'

describe('Payment model tests', () => {
  it('should validate a correct payment object', () => {
    const payment: Payment = {
      id: 'test-id',
      subscription_id: 'subscription-id',
      method: 'bank_transfer',
      amount_aed: 100,
      currency: 'AED',
      status: 'pending',
      provider: 'bank',
      provider_txn_id: 'txn-123',
      receipt_url: 'https://example.com/receipt',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(validatePayment(payment)).toBe(true)
  })

  it('should validate payment with minimal required fields', () => {
    const payment: Payment = {
      id: 'test-id',
      subscription_id: 'subscription-id',
      method: 'bank_transfer',
      amount_aed: 100,
      currency: 'AED',
      status: 'pending',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(validatePayment(payment)).toBe(true)
  })

  it('should reject invalid payment missing required fields', () => {
    const invalidPayment = {
      id: 'test-id',
      // missing subscription_id
      method: 'bank_transfer',
      amount_aed: 100,
      currency: 'AED',
      status: 'pending' as const,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(() => validatePayment(invalidPayment)).toThrow('subscription_id required')
  })

  it('should reject invalid status', () => {
    const invalidPayment = {
      id: 'test-id',
      subscription_id: 'subscription-id',
      method: 'bank_transfer',
      amount_aed: 100,
      currency: 'AED',
      status: 'invalid' as any, // invalid status
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(() => validatePayment(invalidPayment)).toThrow('Invalid status')
  })
})
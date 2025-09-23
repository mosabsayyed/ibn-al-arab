import { describe, it, expect } from 'vitest'
import { Address, validateAddress } from '../../../backend/src/models/address'

describe('Address model tests', () => {
  it('should validate a correct address object', () => {
    const address: Address = {
      id: 'test-id',
      user_id: 'user-id',
      district: 'Sharjah',
      formatted_address: '123 Main St',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(validateAddress(address)).toBe(true)
  })

  it('should validate address without optional formatted_address', () => {
    const address: Address = {
      id: 'test-id',
      user_id: 'user-id',
      district: 'Sharjah',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(validateAddress(address)).toBe(true)
  })

  it('should reject invalid address missing required fields', () => {
    const invalidAddress = {
      id: 'test-id',
      user_id: 'user-id',
      // missing district
      formatted_address: '123 Main St',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(() => validateAddress(invalidAddress)).toThrow('district required')
  })

  it('should reject invalid address missing user_id', () => {
    const invalidAddress = {
      id: 'test-id',
      // missing user_id
      district: 'Sharjah',
      formatted_address: '123 Main St',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    }
    expect(() => validateAddress(invalidAddress)).toThrow('user_id required')
  })
})
import { describe, it, expect } from 'vitest'
import { Profile, validateProfile } from '../../../backend/src/models/profile'

describe('Profile model tests', () => {
  it('should validate a correct profile object', () => {
    const profile: Profile = {
      id: 'test-id',
      full_name: 'John Doe',
      phone: '+971501234567',
      email: 'john@example.com'
    }
    expect(validateProfile(profile)).toBe(true)
  })

  it('should validate profile without optional email', () => {
    const profile: Profile = {
      id: 'test-id',
      full_name: 'John Doe',
      phone: '+971501234567'
    }
    expect(validateProfile(profile)).toBe(true)
  })

  it('should reject invalid profile missing required fields', () => {
    const invalidProfile = {
      id: 'test-id',
      // missing full_name
      phone: '+971501234567'
    }
    expect(() => validateProfile(invalidProfile)).toThrow('full_name required')
  })

  it('should reject invalid profile missing id', () => {
    const invalidProfile = {
      // missing id
      full_name: 'John Doe',
      phone: '+971501234567'
    }
    expect(() => validateProfile(invalidProfile)).toThrow('id required')
  })
})
import { describe, it, expect } from 'vitest'

describe('POST /checkout contract test', () => {
  it('should accept { planId, addressId } and return 200 with checkoutId', async () => {
    const body = { planId: 'd9fbe3ba-d989-4d3b-8c8b-68589409ff65', addressId: 'some-address-id' }
    const res = await fetch('http://127.0.0.1:4101/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data).toHaveProperty('checkoutId')
  })
})
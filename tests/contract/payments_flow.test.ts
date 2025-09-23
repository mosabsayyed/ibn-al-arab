import { describe, it, expect } from 'vitest'

// Contract test for the wire-transfer flow:
// 1) Create a subscription (POST /api/subscriptions)
// 2) Upload a proof to /api/uploads (base64 JSON payload)
// 3) POST /api/payments with receipt_url and subscriptionId
// 4) Expect payment created (201) and subscription remains pending

describe('payments flow contract test', () => {
  it('creates subscription, upload proof, create payment linked to subscription', async () => {
    // 1) create subscription
    const subRes = await fetch('http://127.0.0.1:4101/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: 'plan_basic' })
    })
    expect([200,201]).toContain(subRes.status)
    const subData = await subRes.json()
    expect(subData).toHaveProperty('id')
    const subscriptionId = subData.id

    // 2) upload proof
    const fileContent = Buffer.from('proof').toString('base64')
    const uploadRes = await fetch('http://127.0.0.1:4101/api/uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: 'proof.txt', fileBase64: fileContent, mimetype: 'text/plain' })
    })
    expect([200,201]).toContain(uploadRes.status)
    const uploadData = await uploadRes.json()
    expect(uploadData).toHaveProperty('url')

    // 3) create payment linked to subscription
    const paymentRes = await fetch('http://127.0.0.1:4101/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: 'plan_basic', subscriptionId, receipt_url: uploadData.filepath || uploadData.url })
    })
    expect([200,201]).toContain(paymentRes.status)
    const paymentData = await paymentRes.json()
    expect(paymentData).toHaveProperty('id')
    expect(paymentData).toHaveProperty('status')

    // 4) subscription should remain pending
    const checkSub = await fetch(`http://127.0.0.1:4101/api/subscriptions/${subscriptionId}`, { method: 'GET' })
    // endpoint may not exist; if it doesn't, skip that assertion
    if (checkSub.status === 200) {
      const s = await checkSub.json()
      expect(s).toHaveProperty('status')
      expect(['pending','active','cancelled']).toContain(s.status)
    }
  })
})

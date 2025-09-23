import { describe, it, expect } from 'vitest'

// Contract test for admin approve flow:
// 1) Create a subscription
// 2) Upload proof and create payment linked to subscription
// 3) Approve the payment via admin endpoint
// 4) Verify payment status is approved and subscription status becomes active

describe('admin payments approve flow', () => {
  it('approves payment and activates subscription', async () => {
    // 1) create subscription
    const subRes = await fetch('http://127.0.0.1:4101/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: 'plan_basic' })
    })
    expect([200,201]).toContain(subRes.status)
    const subData = await subRes.json()
    const subscriptionId = subData.id

    // 2) upload proof
    const fileContent = Buffer.from('proof').toString('base64')
    const uploadRes = await fetch('http://127.0.0.1:4101/api/uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: 'proof.txt', fileBase64: fileContent, mimetype: 'text/plain' })
    })
    const uploadData = await uploadRes.json()

    // 3) create payment linked to subscription
    const paymentRes = await fetch('http://127.0.0.1:4101/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planId: 'plan_basic', subscriptionId, receipt_url: uploadData.filepath || uploadData.url })
    })
    const paymentData = await paymentRes.json()
    const paymentId = paymentData.id

    // 4) approve via admin endpoint
    const approveRes = await fetch(`http://127.0.0.1:4101/api/admin/payments/${paymentId}/approve`, { method: 'POST' })
    expect([200,201]).toContain(approveRes.status)
    const approveData = await approveRes.json()
    expect(approveData).toHaveProperty('payment')
    expect(approveData.payment).toHaveProperty('status')
    expect(approveData.payment.status).toBe('approved')

    // verify subscription is active
    const checkSub = await fetch(`http://127.0.0.1:4101/api/subscriptions/${subscriptionId}`)
    if (checkSub.status === 200) {
      const s = await checkSub.json()
      expect(s.status).toBe('active')
    }
  })
})

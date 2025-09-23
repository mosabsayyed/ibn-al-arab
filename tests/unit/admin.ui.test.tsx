import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock AuthContext (use the same path alias the client uses)
vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ profile: { role: 'admin' }, session: { access_token: 'fake' } }),
}))

import { PaymentsReview } from '../../client/pages/Admin'

// Mock useAuth to return an admin profile and a fake session
vi.mock('../../client/context/AuthContext', () => {
  return {
    useAuth: () => ({ profile: { role: 'admin' }, session: { access_token: 'fake' } }),
  }
})

describe('Admin payments UI', () => {
  it('renders payments and approves one', async () => {
    // Mock initial payments list
    const payments = [{ id: 'p1', plan_id: 'planA', status: 'pending', receipt_url: 'http://example.com/receipt.pdf' }]

  // Provide initial payments to avoid network fetch in test
  // Stub only the approve endpoint
  const fetchMock = vi.fn()
  fetchMock.mockResolvedValueOnce({ ok: true, json: async () => ({ payment: { id: 'p1', status: 'approved' } }) })
  vi.stubGlobal('fetch', fetchMock)

  render(React.createElement(PaymentsReview as any, { initialPayments: payments }))

    // Wait for payment to appear
    await waitFor(() => {
      const el = screen.queryByText(/Payment: p1/)
      if (!el) throw new Error('not found')
      return true
    })

    const approveBtn = screen.getByText('Approve')
    fireEvent.click(approveBtn)

    // After approving, the payment row should disappear
    await waitFor(() => {
      const el = screen.queryByText(/Payment: p1/)
      if (el) throw new Error('still present')
      return true
    })

    // Cleanup stub
    vi.unstubAllGlobals()
  })
})

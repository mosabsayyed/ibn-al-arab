import { describe, it, expect } from 'vitest'

// This contract test expects a running backend at localhost:4101
// It will POST a small JSON payload containing base64 file content and expect a 201 with a url

describe('POST /api/uploads contract test', () => {
  it('should accept base64 payload and return 201 with url', async () => {
    const fileContent = Buffer.from('hello world').toString('base64')
    const body = { filename: 'hello.txt', fileBase64: fileContent, mimetype: 'text/plain' }
    const res = await fetch('http://127.0.0.1:4101/api/uploads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    expect([200, 201]).toContain(res.status)
    const data = await res.json()
    expect(data).toHaveProperty('url')
  })
})

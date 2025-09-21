# Contract tests (skeleton)

This folder contains skeletons for contract tests that should be run against the API implementation.

- test_plans.js (asserts /plans response schema)
- test_checkout.js (asserts /checkout request/response schema)

Example (pseudo):

```
describe('GET /plans contract', () => {
  it('returns an array of Plan objects with required fields', async () => {
    const res = await request(app).get('/plans')
    assert(res.status === 200)
    assert(Array.isArray(res.body))
    assert(res.body[0].id)
  })
})
```

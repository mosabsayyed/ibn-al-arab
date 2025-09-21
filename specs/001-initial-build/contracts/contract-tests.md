# Contract Tests — 001-initial-build

This document outlines minimal contract tests for the initial-build API:

- `GET /plans` — assert status 200 and response conforms to `Plan` schema.
- `POST /checkout` — send `{ planId, addressId }` and expect `200` and a `checkoutId` in response.

These are skeletons; implement using the project's preferred test runner and a mock server or a staging endpoint.

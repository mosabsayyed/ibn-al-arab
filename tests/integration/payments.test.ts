import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import paymentsRouter from '../../backend/src/api/payments';
import * as fs from 'fs/promises';
import path from 'path';

describe('Payments API', () => {
  const uploadDir = path.resolve('./test-uploads-payments');
  let app: express.Express;

  beforeEach(async () => {
    // ensure clean upload directory used by storage (router writes to ./uploads by default)
    try {
      await fs.rm(uploadDir, { recursive: true });
    } catch {}
    await fs.mkdir(uploadDir, { recursive: true });

    // mount router on an express app
    app = express();
    // Use the payments router directly; it writes to ./uploads by default.
    app.use('/api/payments', paymentsRouter as any);
  });

  afterEach(async () => {
    try {
      await fs.rm(uploadDir, { recursive: true });
    } catch {}
    // Also cleanup default uploads dir
    try {
      await fs.rm(path.resolve('./uploads'), { recursive: true });
    } catch {}
  });

  it('accepts proof upload and returns payment record', async () => {
    const res = await request(app)
      .post('/api/payments')
      .field('planId', 'testplan')
      .attach('proof', Buffer.from('hello'), 'proof.txt');

  expect(res.status).toBe(201);
  // router returns the payment object as the body directly
  expect(res.body).toBeTruthy();
  expect(res.body.status).toBe('pending');
  const receipt = res.body.receipt_url;
  expect(typeof receipt).toBe('string');

    // verify file exists on disk
  const fullPath = path.join(process.cwd(), 'uploads', receipt);
    const exists = await fs.access(fullPath).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });
});

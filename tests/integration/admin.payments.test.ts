import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import paymentsRouter, { getPaymentsStore } from '../../backend/src/api/payments';
import adminRouter from '../../backend/src/api/adminPayments';
import * as fs from 'fs/promises';
import path from 'path';

describe('Admin Payments API', () => {
  let app: express.Express;

  beforeEach(async () => {
    // cleanup uploads
    try { await fs.rm(path.resolve('./uploads'), { recursive: true }); } catch {}
    await fs.mkdir(path.resolve('./uploads'), { recursive: true });

    app = express();
    app.use('/api/payments', paymentsRouter as any);
    app.use('/api/admin/payments', adminRouter as any);
  });

  afterEach(async () => {
    try { await fs.rm(path.resolve('./uploads'), { recursive: true }); } catch {}
  });

  it('lists pending payments and can approve/reject', async () => {
    // create a payment via payments router
    const create = await request(app)
      .post('/api/payments')
      .field('planId', 'admintest')
      .attach('proof', Buffer.from('ok'), 'p.txt');

    expect(create.status).toBe(201);
    const payment = create.body;
    expect(payment.status).toBe('pending');

    // ensure admin list shows it
    const list = await request(app).get('/api/admin/payments?status=pending');
    expect(list.status).toBe(200);
    expect(list.body.count).toBeGreaterThanOrEqual(1);

    // approve it
    const approve = await request(app).post(`/api/admin/payments/${payment.id}/approve`);
    expect(approve.status).toBe(200);
    expect(approve.body.payment.status).toBe('approved');

    // reject a non-existent id
    const reject = await request(app).post('/api/admin/payments/not-found/reject');
    expect(reject.status).toBe(404);
  });
});

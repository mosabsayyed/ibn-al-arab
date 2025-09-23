import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { getPlansHandler } from './src/api/plans.js';
import paymentsRouter from './src/api/payments.js';
import adminPaymentsRouter from './src/api/adminPayments.js';
import subscriptionsRouter from './src/api/subscriptions.js';
import checkoutRouter from './src/api/checkout.js';
import uploadsRouter from './src/api/uploads.js';
import { getMealsHandler } from './src/api/meals.js';
import profilesRouter from './src/api/profiles.js';

const app = express();
const port = 4101;

app.use(cors());
app.use(express.json());

// Set a permissive-enough Content Security Policy for local/dev and some CDNs
// If your production host defines stricter CSP headers, update there instead.
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https://api.supabase.com https://auth.supabase.io https://*.supabase.co https://cdnjs.cloudflare.com; connect-src 'self' https://api.supabase.com https://auth.supabase.io https://*.supabase.co https://cdnjs.cloudflare.com ws: wss:; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;"
  );
  next();
});

// serve uploaded files (for signed url demo, files are public here)
app.use('/files', express.static('./uploads'));

app.use('/api/payments', paymentsRouter);
app.use('/api/admin/payments', adminPaymentsRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/checkout', checkoutRouter);
app.use('/api/uploads', uploadsRouter);
app.get('/api/meals', getMealsHandler);
app.use('/api/profiles', profilesRouter);

app.get('/api/plans', getPlansHandler);

app.listen(port, () => {
  console.log(`🚀 Backend server listening at http://localhost:${port}`);
});

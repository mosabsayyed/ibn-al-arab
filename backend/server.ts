import express from 'express';
import cors from 'cors';
import { getPlansHandler } from './src/api/plans.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/plans', getPlansHandler);

app.listen(port, () => {
  console.log(`🚀 Backend server listening at http://localhost:${port}`);
});

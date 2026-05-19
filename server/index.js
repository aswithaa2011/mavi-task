import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import groupRoutes   from './routes/groupRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';

const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5174' }));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: '✅ Expense Tracker API running' }));

app.use('/api/groups',   groupRoutes);
app.use('/api/expenses', expenseRoutes);

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// ── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`   Supabase URL: ${process.env.SUPABASE_URL ? '✅ connected' : '❌ missing'}`);
});

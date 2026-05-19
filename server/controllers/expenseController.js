import { supabase } from '../config/supabase.js';

// GET /api/expenses — list all expenses (optionally filter by user_id or group_id)
export const getExpenses = async (req, res) => {
  const { user_id, group_id } = req.query;

  let query = supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (user_id)  query = query.eq('user_id', user_id);
  if (group_id) query = query.eq('group_id', group_id);

  const { data, error } = await query;
  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
};

// POST /api/expenses — add a new expense
export const createExpense = async (req, res) => {
  const { amount, description, date, user_id, group_id } = req.body;

  // Server-side validation (mirrors client-side Task 4)
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ message: 'Amount must be a positive number.' });
  }
  if (!description || !description.trim()) {
    return res.status(400).json({ message: 'Description is required.' });
  }
  if (!date) {
    return res.status(400).json({ message: 'Date is required.' });
  }

  const { data, error } = await supabase
    .from('expenses')
    .insert([{
      amount: Number(amount),
      description: description.trim(),
      date,
      user_id: user_id || null,
      group_id: group_id || null,
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data);
};

// GET /api/expenses/summary — total and count for a user
export const getExpenseSummary = async (req, res) => {
  const { user_id } = req.query;

  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', user_id);

  if (error) return res.status(500).json({ message: error.message });

  const total   = data.reduce((sum, e) => sum + Number(e.amount), 0);
  const count   = data.length;
  const highest = data.length ? Math.max(...data.map(e => Number(e.amount))) : 0;

  res.json({ total, count, highest });
};

// DELETE /api/expenses/:id — remove an expense
export const deleteExpense = async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ message: error.message });
  res.json({ message: 'Expense deleted.' });
};

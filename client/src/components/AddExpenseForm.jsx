import React, { useState } from 'react';

// Task 2 + Task 4 — Add Expense Form with client-side validation + real Supabase insert
export default function AddExpenseForm({ userId, onExpenseAdded }) {
  const [amount, setAmount]             = useState('');
  const [description, setDescription]   = useState('');
  const [date, setDate]                 = useState(new Date().toISOString().split('T')[0]);
  const [errors, setErrors]             = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess]           = useState(false);
  const [serverError, setServerError]   = useState('');

  // Task 4: pure client-side validation — runs before any DB call
  const validate = () => {
    const errs = {};
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0)  errs.amount      = 'Enter a valid positive amount.';
    if (!description.trim())                 errs.description = 'Description cannot be empty.';
    if (!date)                               errs.date        = 'Please select a date.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');
    setSuccess(false);

    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setIsSubmitting(true);
    try {
      // POST to Express backend — uses service_role key, bypasses RLS
      const res = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount:      parseFloat(amount),
          description: description.trim(),
          date,
          user_id: userId || '00000000-0000-0000-0000-000000000000',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save expense.');


      setSuccess(true);
      if (onExpenseAdded) onExpenseAdded(data || { amount: parseFloat(amount), description, date });

      setTimeout(() => {
        setAmount(''); setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setSuccess(false);
      }, 1400);

    } catch (err) {
      console.error(err);
      setServerError(err.message || 'Failed to save expense. Check your Supabase credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase = `w-full bg-white/5 border border-white/10 text-slate-100 placeholder-slate-600
    rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200
    focus:border-violet-500 focus:bg-violet-500/10 focus:ring-1 focus:ring-violet-500/30`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="animate-fadeInUp delay-200 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6"
    >
      <div className="mb-5">
        <h3 className="font-bold text-slate-100 text-base">Add Expense</h3>
        <p className="text-xs text-slate-500 mt-1">Fill in the details below</p>
      </div>

      {/* Server error */}
      {serverError && (
        <div className="mb-4 px-4 py-2.5 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-400">
          ⚠ {serverError}
        </div>
      )}

      <div className="flex flex-col gap-4">
        {/* Amount */}
        <div>
          <label className="block text-[0.7rem] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
            Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-semibold text-sm select-none">₹</span>
            <input
              type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="0.00" step="0.01"
              className={`${inputBase} pl-7 ${errors.amount ? 'border-red-500/60' : ''}`}
            />
          </div>
          {errors.amount && <p className="mt-1.5 text-xs text-red-400">⚠ {errors.amount}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-[0.7rem] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
            Description
          </label>
          <input
            type="text" value={description} onChange={e => setDescription(e.target.value)}
            placeholder="What was this expense for?"
            className={`${inputBase} ${errors.description ? 'border-red-500/60' : ''}`}
          />
          {errors.description && <p className="mt-1.5 text-xs text-red-400">⚠ {errors.description}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-[0.7rem] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
            Date
          </label>
          <input
            type="date" value={date} onChange={e => setDate(e.target.value)}
            className={`${inputBase} ${errors.date ? 'border-red-500/60' : ''}`}
          />
          {errors.date && <p className="mt-1.5 text-xs text-red-400">⚠ {errors.date}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || success}
          className="mt-1 flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white
            bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-500 hover:to-purple-400
            disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
            shadow-lg shadow-violet-500/20"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin-slow w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
              </svg>
              Saving to Supabase...
            </>
          ) : success ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Expense
            </>
          )}
        </button>
      </div>
    </form>
  );
}

import React, { useEffect } from 'react';

// Task 3 — Expenses Summary Modal
export default function ExpenseSummaryModal({ isOpen, onClose, expenses = [] }) {
  const total   = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
  const highest = expenses.length ? Math.max(...expenses.map(e => Number(e.amount))) : 0;

  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const stats = [
    { label: 'Grand Total',     value: `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: 'text-purple-400' },
    { label: 'No. of Entries',  value: expenses.length,                                                    color: 'text-cyan-400'   },
    { label: 'Highest Expense', value: `₹${highest.toLocaleString('en-IN')}`,                             color: 'text-amber-400'  },
  ];

  return (
    <div
      className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="animate-scaleIn relative w-full max-w-md rounded-3xl p-7
          bg-[#14141f] border border-white/10
          shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.05)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Close btn */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-white/[0.06] border border-white/10
            text-slate-400 hover:text-slate-200 hover:bg-white/[0.12] transition-all
            flex items-center justify-center"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-2xl mb-4">
            📊
          </div>
          <h2 className="text-xl font-extrabold text-slate-100">Total Expenses Summary</h2>
          <p className="text-sm text-slate-500 mt-1">Your complete expense breakdown</p>
        </div>

        {/* Big total */}
        <div className="bg-violet-500/10 border border-violet-500/25 rounded-2xl p-6 text-center mb-5">
          <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Grand Total</p>
          <p className="text-4xl font-extrabold text-slate-100 tracking-tight">
            ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {stats.map(s => (
            <div key={s.label} className="bg-white/[0.04] border border-white/[0.07] rounded-xl p-3.5 text-center">
              <p className={`text-base font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-[0.65rem] text-slate-500 mt-1 font-medium leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent list */}
        {expenses.length > 0 && (
          <div className="mb-5">
            <p className="text-[0.68rem] font-semibold text-slate-600 uppercase tracking-widest mb-2">Recent</p>
            <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
              {[...expenses].reverse().slice(0, 5).map((exp, i) => (
                <div key={i} className="flex justify-between items-center px-3.5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{exp.description}</p>
                    <p className="text-[0.68rem] text-slate-600 mt-0.5">{exp.date}</p>
                  </div>
                  <span className="text-sm font-bold text-purple-400">
                    ₹{Number(exp.amount).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white/[0.06] border border-white/10 text-slate-300
            font-semibold text-sm hover:bg-white/[0.1] transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
}

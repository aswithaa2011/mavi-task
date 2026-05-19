import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import GroupCard from '../components/GroupCard';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseSummaryModal from '../components/ExpenseSummaryModal';

import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.png';
import img4 from '../assets/4.jpg';
import img5 from '../assets/5.jpg';
import heroImg from '../assets/hero.png';

const SAMPLE_GROUPS = [
  { id: 1, name: 'CSK Cricket team', icon: '🏏', summary: 'Ticket fees & match expenses', amount: 3500, image: img4 },
  { id: 2, name: 'Goa Trip',         icon: '🏖️', summary: 'Travel and stay',              amount: 12400 },
  { id: 3, name: 'Roommates',        icon: '🏠', summary: 'Rent and utilities',            amount: 8000 },
  { id: 4, name: 'Birthday Party',   icon: '🎉', summary: 'Decoration & food',             amount: 5200 },
];

export default function Dashboard() {
  const [profile, setProfile]           = useState(null);
  const [userId, setUserId]             = useState(null);
  const [loadingProfile, setLoading]    = useState(true);
  const [expenses, setExpenses]         = useState([]);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [activeTab, setActiveTab]       = useState('groups');
  const [greeting, setGreeting]         = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');
  }, []);

  // ── Task 5: Fetch user profile from Supabase ─────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Step 1 — get authenticated user
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError || !authData?.user) {
          // No active session → show mock profile so UI still renders
          console.log('No session — using mock profile.');
          setProfile({ name: 'Aswith Kumar', avatar_url: img3 });
          setLoading(false);
          return;
        }

        const user = authData.user;
        setUserId(user.id);

        // Step 2 — SELECT name, avatar_url from profiles WHERE id = user.id
        const { data, error } = await supabase
          .from('profiles')
          .select('name, avatar_url')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);

      } catch (err) {
        console.error('Profile fetch error:', err.message);
        setProfile({ name: 'Aswith Kumar', avatar_url: img3 });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Fetch existing expenses from Supabase on mount
  useEffect(() => {
    if (!userId) return;
    const fetchExpenses = async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) setExpenses(data);
    };
    fetchExpenses();
  }, [userId]);

  const handleExpenseAdded = (exp) => setExpenses(prev => [exp, ...prev]);
  const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-100 relative overflow-hidden">

      {/* Glow orbs */}
      <div className="fixed w-[480px] h-[480px] rounded-full bg-violet-700 opacity-[0.12] blur-[90px] -top-40 -left-40 pointer-events-none" />
      <div className="fixed w-[380px] h-[380px] rounded-full bg-cyan-500  opacity-[0.10] blur-[90px] -bottom-28 -right-28 pointer-events-none" />

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-6
        bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <img src={heroImg} alt="logo" className="w-8 h-8 rounded-xl object-contain" />
          <span className="font-extrabold text-base text-slate-100">
            Split<span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">Wise Pro</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setSummaryOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold
              bg-violet-500/15 border border-violet-500/30 text-violet-400
              hover:bg-violet-500/25 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Expenses Summary
          </button>

          {/* Task 5 — user avatar from Supabase profiles */}
          {loadingProfile
            ? <div className="w-9 h-9 rounded-full bg-white/10 animate-pulse" />
            : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 hidden sm:block">{profile?.name}</span>
                <img
                  src={profile?.avatar_url || img3}
                  alt={profile?.name}
                  title={profile?.name}
                  className="w-9 h-9 rounded-full border-2 border-violet-500/40 object-cover cursor-pointer"
                  onError={e => { e.currentTarget.src = img3; }}
                />
              </div>
            )
          }
        </div>
      </header>

      {/* ── HERO BANNER ────────────────────────────────────────────────── */}
      <div className="relative h-44 overflow-hidden">
        <img src={img1} alt="hero" className="w-full h-full object-cover brightness-[0.3]" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-700/50 to-cyan-600/20" />
        <div className="absolute inset-0 flex flex-col justify-center px-8">
          <p className="text-xs text-white/60 mb-2">
            {greeting}, {loadingProfile ? '...' : profile?.name?.split(' ')[0]} 👋
          </p>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            Manage your{' '}
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              shared expenses
            </span>
          </h1>
          <p className="text-sm text-white/50 mt-2">Track, split & settle with your groups</p>
        </div>
      </div>

      {/* ── MAIN ───────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-6 py-8 relative z-10">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8 animate-fadeInUp delay-100">
          {[
            { label: 'Total Spent',   value: `₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, icon: '💸', color: 'text-purple-400', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
            { label: 'Active Groups', value: SAMPLE_GROUPS.length,  icon: '👥', color: 'text-cyan-400',   badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
            { label: 'Transactions',  value: expenses.length,        icon: '📋', color: 'text-amber-400',  badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
          ].map(s => (
            <div key={s.label} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:bg-white/[0.07] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl">{s.icon}</span>
                <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${s.badge}`}>Live</span>
              </div>
              <p className={`text-2xl font-extrabold ${s.color} mb-1`}>{s.value}</p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* 2-col layout */}
        <div className="grid grid-cols-[1fr_320px] gap-6 items-start">

          {/* Left */}
          <div>
            {/* Tabs */}
            <div className="animate-fadeInUp delay-200 inline-flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] mb-5">
              {[
                { key: 'groups',   label: '👥 Groups' },
                { key: 'expenses', label: '🧾 My Expenses' },
              ].map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === t.key
                      ? 'bg-gradient-to-r from-violet-600 to-purple-500 text-white shadow-lg shadow-violet-500/20'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Groups */}
            {activeTab === 'groups' && (
              <div className="grid grid-cols-2 gap-3">
                {SAMPLE_GROUPS.map((g, i) => (
                  <GroupCard key={g.id} {...g} delay={i * 80} />
                ))}
              </div>
            )}

            {/* Expenses */}
            {activeTab === 'expenses' && (
              <div className="flex flex-col gap-2.5">
                {expenses.length === 0 ? (
                  <div className="animate-fadeInUp bg-white/[0.04] border border-white/[0.08] rounded-2xl p-12 text-center">
                    <p className="text-3xl mb-3">🧾</p>
                    <p className="font-semibold text-slate-400">No expenses yet</p>
                    <p className="text-xs text-slate-600 mt-1">Add your first expense using the form →</p>
                  </div>
                ) : (
                  expenses.map((exp, i) => (
                    <div key={exp.id || i} className="animate-fadeInUp flex justify-between items-center px-5 py-3.5
                      bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.07] transition-colors">
                      <div>
                        <p className="font-semibold text-sm text-slate-200">{exp.description}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{exp.date}</p>
                      </div>
                      <span className="font-extrabold text-sm text-purple-400">
                        ₹{Number(exp.amount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Right */}
          <div className="sticky top-20 flex flex-col gap-4">
            <AddExpenseForm userId={userId} onExpenseAdded={handleExpenseAdded} />

            {/* Gallery */}
            <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 animate-fadeInUp delay-300">
              <p className="text-[0.65rem] font-semibold text-slate-600 uppercase tracking-widest mb-3">
                📸 CSK Group Gallery
              </p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {[img2, img5].map((src, i) => (
                  <img key={i} src={src} alt={`CSK ${i + 1}`}
                    className="w-full h-16 object-cover rounded-xl border border-white/[0.08] hover:brightness-110 transition-all cursor-pointer" />
                ))}
              </div>
              <img src={img1} alt="CSK Champions"
                className="w-full h-12 object-cover rounded-xl border border-white/[0.08] hover:brightness-110 transition-all cursor-pointer object-top" />
            </div>
          </div>
        </div>
      </main>

      <ExpenseSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setSummaryOpen(false)}
        expenses={expenses}
      />
    </div>
  );
}

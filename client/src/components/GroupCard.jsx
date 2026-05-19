import React from 'react';

const accentMap = {
  '🏏': { ring: 'ring-emerald-500/30', text: 'text-emerald-400', iconBg: 'bg-emerald-500/10', glow: 'hover:shadow-emerald-500/20' },
  '🏖️': { ring: 'ring-amber-500/30',   text: 'text-amber-400',   iconBg: 'bg-amber-500/10',   glow: 'hover:shadow-amber-500/20' },
  '🏠': { ring: 'ring-indigo-500/30',  text: 'text-indigo-400',  iconBg: 'bg-indigo-500/10',  glow: 'hover:shadow-indigo-500/20' },
  '🎉': { ring: 'ring-pink-500/30',    text: 'text-pink-400',    iconBg: 'bg-pink-500/10',    glow: 'hover:shadow-pink-500/20' },
  '✈️': { ring: 'ring-cyan-500/30',    text: 'text-cyan-400',    iconBg: 'bg-cyan-500/10',    glow: 'hover:shadow-cyan-500/20' },
};

// Task 1 — Group Card Component
export default function GroupCard({ name, icon, summary, amount, image, delay = 0 }) {
  const a = accentMap[icon] || { ring: 'ring-purple-500/30', text: 'text-purple-400', iconBg: 'bg-purple-500/10', glow: 'hover:shadow-purple-500/20' };

  return (
    <div
      className={`animate-fadeInUp rounded-2xl overflow-hidden cursor-pointer
        bg-white/[0.04] border border-white/[0.08] ring-1 ${a.ring}
        hover:bg-white/[0.07] hover:border-white/[0.14]
        hover:-translate-y-1 hover:shadow-lg ${a.glow}
        transition-all duration-200`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Banner image */}
      {image && (
        <div className="relative h-28 overflow-hidden">
          <img src={image} alt={name} className="w-full h-full object-cover brightness-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/90 to-transparent" />
          <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm border border-white/15 flex items-center justify-center text-base">
            {icon}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex items-center gap-3 px-4 py-3.5">
        {/* Icon (only when no image banner) */}
        {!image && (
          <div className={`w-11 h-11 rounded-xl ${a.iconBg} border border-white/10 flex items-center justify-center text-xl shrink-0`}>
            {icon}
          </div>
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-slate-100 truncate">{name}</h3>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{summary}</p>
        </div>

        {/* Amount + arrow */}
        <div className="shrink-0 text-right">
          {amount != null && (
            <p className={`font-extrabold text-sm ${a.text}`}>
              ₹{amount.toLocaleString('en-IN')}
            </p>
          )}
          <svg className="w-3.5 h-3.5 text-slate-600 mt-1 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function StatCard({ icon, label, value, color = 'amber' }) {
  const colorMap = {
    amber:   { bg: '#fff8e6', accent: '#f59e0b', border: '#fde68a' },
    emerald: { bg: '#ecfdf5', accent: '#10b981', border: '#6ee7b7' },
    rose:    { bg: '#fff1f2', accent: '#f43f5e', border: '#fda4af' },
    blue:    { bg: '#eff6ff', accent: '#3b82f6', border: '#93c5fd' },
    indigo:  { bg: '#eef2ff', accent: '#6366f1', border: '#a5b4fc' },
    violet:  { bg: '#f5f3ff', accent: '#8b5cf6', border: '#c4b5fd' },
  };
  const c = colorMap[color] || colorMap.amber;

  return (
    <div
      className="rounded-2xl p-5 group hover:-translate-y-1 transition-all duration-300 cursor-default"
      style={{ background: c.bg, border: `2px solid ${c.border}` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ background: c.accent + '25' }}
        >
          {icon}
        </div>
        <div
          className="w-2 h-2 rounded-full mt-1.5"
          style={{ background: c.accent }}
        />
      </div>
      <p className="text-3xl font-black text-stone-900 mb-0.5" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>{value}</p>
      <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">{label}</p>
    </div>
  );
}

export default function StatCard({ icon, label, value, color = 'indigo' }) {
  const colorMap = {
    indigo: 'from-indigo-500 to-purple-600',
    emerald: 'from-emerald-500 to-teal-600',
    amber: 'from-amber-500 to-orange-600',
    rose: 'from-rose-500 to-pink-600',
    blue: 'from-blue-500 to-indigo-600',
    violet: 'from-violet-500 to-purple-600',
  };

  const gradient = colorMap[color] || colorMap.indigo;

  return (
    <div className="card group hover:scale-105 transition-all duration-300 cursor-default">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

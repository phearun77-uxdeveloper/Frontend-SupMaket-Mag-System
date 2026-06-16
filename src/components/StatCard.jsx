import { ArrowUpRight } from "lucide-react";

function StatCard({ title, value, description, icon: Icon, color }) {
  const colors = {
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    violet: "bg-violet-100 text-violet-700",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
        </div>

        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={23} />
        </div>
      </div>

      <p className="mt-4 flex items-center gap-1 text-sm text-slate-500">
        <ArrowUpRight size={16} className="text-emerald-600" />
        {description}
      </p>
    </article>
  );
}

export default StatCard;
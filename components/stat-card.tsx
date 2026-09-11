import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, detail, icon: Icon, tone = "green" }: { label: string; value: string; detail: string; icon: LucideIcon; tone?: "green" | "orange" | "blue" | "rose" }) {
  const tones = { green: "bg-[#e4f1eb] text-[#26705b]", orange: "bg-[#fff0df] text-[#bc6b38]", blue: "bg-[#e4edf5] text-[#46718d]", rose: "bg-[#fae7e4] text-[#b35d58]" };
  return <div className="rounded-2xl border border-[#e3e9eb] bg-white p-5 shadow-[0_5px_20px_rgba(24,35,47,0.03)]"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p><p className="mt-3 text-[28px] font-semibold tracking-[-0.04em]">{value}</p></div><span className={`grid size-10 place-items-center rounded-xl ${tones[tone]}`}><Icon size={19} /></span></div><p className="mt-3 text-xs text-slate-500">{detail}</p></div>;
}

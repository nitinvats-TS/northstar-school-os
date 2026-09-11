"use client";

import { ArrowDownToLine, Bell, BookOpen, CalendarDays, CheckCircle2, FileText, Loader2, Megaphone, Save, Users, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { useAuth } from "@/components/auth-provider";
import type { OperationModule } from "@/lib/operations-store";

type DashboardData = { title: string; summary: string; stats: { label: string; value: string; detail: string; tone?: "green" | "orange" | "blue" | "rose" }[]; sections: { title: string; description: string; rows: Record<string, string>[] }[] };
const icons = { fees: WalletCards, exams: BookOpen, timetable: CalendarDays, announcements: Megaphone, reports: FileText, "parent-portal": Users, "student-portal": CheckCircle2, "teacher-portal": Users };
const canModify = ["SUPER_ADMIN", "DIRECTOR", "FRONT_OFFICE", "TEACHER"];

export function OperationsDashboard({ module }: { module: OperationModule }) {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const Icon = icons[module];
  useEffect(() => { fetch(`/api/operations/${module}`).then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result.message ?? "Module could not be loaded."); setData(result.data); }).catch((loadError: Error) => setError(loadError.message)).finally(() => setLoading(false)); }, [module]);
  async function saveAction() { setNotice(""); const response = await fetch(`/api/operations/${module}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save" }) }); const result = await response.json(); if (!response.ok) setError(result.message); else setNotice(result.message); }
  if (loading) return <div className="rounded-2xl border border-[#e3e9eb] bg-white p-10 text-center text-sm text-slate-500"><Loader2 size={18} className="mx-auto mb-2 animate-spin" />Loading module...</div>;
  if (error || !data) return <div role="alert" className="rounded-2xl border border-[#f0c9c4] bg-[#fff7f5] p-5 text-sm text-[#b35d58]">{error || "Module unavailable."}</div>;
  return <div><PageHeader eyebrow="Northstar School OS" title={data.title} description={data.summary} action={canModify.includes(user?.role ?? "") ? module === "reports" ? "Export report" : "Create new" : undefined} /><div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{data.stats.map((stat) => <StatCard key={stat.label} {...stat} icon={Icon} />)}</div>{notice && <p role="status" className="mb-5 rounded-xl border border-[#b8d7cd] bg-[#eaf4f0] px-4 py-3 text-sm font-medium text-[#26705b]">{notice}</p>}<div className="grid gap-6 xl:grid-cols-2">{data.sections.map((section) => <section key={section.title} className="overflow-hidden rounded-2xl border border-[#e3e9eb] bg-white shadow-[0_5px_20px_rgba(24,35,47,0.03)]"><div className="flex items-start justify-between border-b border-[#edf0f1] p-5"><div><h2 className="font-semibold">{section.title}</h2><p className="mt-1 text-xs text-slate-500">{section.description}</p></div>{canModify.includes(user?.role ?? "") && <button onClick={saveAction} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#1c5b4d] hover:bg-[#eaf4f0]"><Save size={14} />Save</button>}</div><div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-[#fafbfb] text-[10px] uppercase tracking-[0.12em] text-slate-500"><tr>{Object.keys(section.rows[0] ?? {}).map((key) => <th key={key} className="px-5 py-3 font-semibold">{key}</th>)}</tr></thead><tbody className="divide-y divide-[#edf0f1]">{section.rows.map((row, index) => <tr key={index} className="hover:bg-[#fbfdfc]">{Object.entries(row).map(([key, value]) => <td key={key} className="px-5 py-4 text-slate-600">{key.toLowerCase().includes("status") ? <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${value === "Paid" || value === "Published" || value === "Complete" || value === "Active" ? "bg-[#e4f1eb] text-[#26705b]" : value === "Pending" || value === "Planning" || value === "Draft" ? "bg-[#fff0df] text-[#bc6b38]" : "bg-[#e4edf5] text-[#46718d]"}`}>{value}</span> : value}</td>)}</tr>)}</tbody></table></div></section>)}</div>{module === "fees" && <div className="mt-6 flex justify-end"><button className="inline-flex items-center gap-2 rounded-xl border border-[#dce4e6] bg-white px-4 py-2.5 text-sm font-semibold text-slate-600"><ArrowDownToLine size={16} />Download defaulter report</button></div>}{module === "announcements" && <div className="mt-6 rounded-2xl border border-[#dce4e6] bg-[#102a36] p-5 text-white"><p className="flex items-center gap-2 text-sm font-semibold"><Bell size={16} className="text-[#f3a44b]" />Role-based delivery is enabled</p><p className="mt-2 text-xs text-slate-300">Announcements can target Parents, Students, Teachers, Front Office or the entire school.</p></div>}</div>;
}

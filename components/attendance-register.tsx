"use client";

import { Check, CircleAlert, Clock3, FileCheck2, Loader2, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { canMarkSubject, teacherAssignedClasses } from "@/lib/attendance-permissions";
import { useAuth } from "@/components/auth-provider";
import type { AttendanceEntry, AttendanceStatus, AttendanceSubject } from "@/lib/attendance-types";

const statuses: { value: AttendanceStatus; label: string; icon: typeof Check; color: string }[] = [
  { value: "PRESENT", label: "Present", icon: Check, color: "text-[#26705b] bg-[#e4f1eb]" },
  { value: "ABSENT", label: "Absent", icon: CircleAlert, color: "text-[#b35d58] bg-[#fae7e4]" },
  { value: "LATE", label: "Late", icon: Clock3, color: "text-[#bc6b38] bg-[#fff0df]" },
  { value: "EXCUSED", label: "Excused", icon: FileCheck2, color: "text-[#46718d] bg-[#e4edf5]" },
];

export function AttendanceRegister() {
  const { user } = useAuth();
  const [subject, setSubject] = useState<AttendanceSubject>(user?.role === "TEACHER" ? "student" : "student");
  const [className, setClassName] = useState(user?.role === "TEACHER" ? "8A" : "all");
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const date = new Date().toISOString().slice(0, 10);
  const canMark = user ? canMarkSubject(user.role, subject) : false;
  const classes = user?.role === "TEACHER" ? teacherAssignedClasses(user.email) : ["all", "6C", "8A", "9A", "10B"];

  useEffect(() => {
    const query = new URLSearchParams({ date, subject });
    if (subject === "student" && className !== "all") query.set("className", className);
    fetch(`/api/attendance?${query}`).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Attendance could not be loaded.");
      setEntries(data.entries);
    }).catch((loadError: Error) => setError(loadError.message)).finally(() => setLoading(false));
  }, [subject, className, date]);

  const counts = useMemo(() => statuses.reduce((result, status) => ({ ...result, [status.value]: entries.filter((entry) => entry.status === status.value).length }), {} as Record<AttendanceStatus, number>), [entries]);

  function setStatus(personId: string, status: AttendanceStatus) {
    setEntries((current) => current.map((entry) => entry.personId === personId ? { ...entry, status } : entry));
  }

  async function save() {
    setSaving(true); setMessage(""); setError("");
    const response = await fetch("/api/attendance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date, subject, className, entries: entries.map((entry) => ({ personId: entry.personId, status: entry.status, note: entry.note ?? undefined })) }) });
    const data = await response.json();
    if (!response.ok) setError(data.message ?? "Attendance could not be saved.");
    else setMessage("Attendance saved successfully.");
    setSaving(false);
  }

  return <section className="rounded-2xl border border-[#e3e9eb] bg-white p-5 shadow-[0_5px_20px_rgba(24,35,47,0.03)]"><div className="mb-5 flex flex-col gap-4 border-b border-[#edf0f1] pb-5 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="font-semibold">Daily attendance register</h2><p className="mt-1 text-xs text-slate-500">{date} · {canMark ? "Update statuses and save when ready." : "View-only attendance for your account."}</p></div><div className="flex flex-wrap gap-2">{user && user.role !== "TEACHER" && <select value={subject} onChange={(event) => setSubject(event.target.value as AttendanceSubject)} className="h-10 rounded-xl border border-[#dce4e6] bg-white px-3 text-sm text-slate-600"><option value="student">Student attendance</option><option value="teacher">Teacher attendance</option></select>}{subject === "student" && <select value={className} onChange={(event) => setClassName(event.target.value)} className="h-10 rounded-xl border border-[#dce4e6] bg-white px-3 text-sm text-slate-600">{classes.map((item) => <option key={item} value={item}>{item === "all" ? "All classes" : `Grade ${item}`}</option>)}</select>}{canMark && <button onClick={save} disabled={saving || !entries.length} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1c5b4d] px-3 text-sm font-semibold text-white disabled:opacity-60">{saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}Save</button>}</div></div>{message && <p role="status" className="mb-4 rounded-xl border border-[#b8d7cd] bg-[#eaf4f0] px-3 py-2 text-sm text-[#26705b]">{message}</p>}{error && <p role="alert" className="mb-4 rounded-xl bg-[#fae7e4] px-3 py-2 text-sm text-[#b35d58]">{error}</p>}<div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{statuses.map(({ value, label, icon: Icon, color }) => <div key={value} className={`rounded-xl px-3 py-2 ${color}`}><div className="flex items-center gap-2 text-xs font-semibold"><Icon size={14} />{label}</div><p className="mt-1 text-lg font-semibold">{loading ? "-" : counts[value]}</p></div>)}</div>{loading ? <p className="py-10 text-center text-sm text-slate-500">Loading attendance...</p> : entries.length === 0 ? <p className="py-10 text-center text-sm text-slate-500">No attendance records found for this view.</p> : <div className="divide-y divide-[#edf0f1]">{entries.map((entry) => <div key={entry.personId} className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-sm font-semibold">{entry.name}</p><p className="mt-1 text-xs text-slate-500">{entry.className ? `Grade ${entry.className}${entry.section}` : entry.subject}</p></div>{canMark ? <div className="grid grid-cols-2 gap-1 sm:flex">{statuses.map(({ value, label }) => <button key={value} onClick={() => setStatus(entry.personId, value)} className={`rounded-lg px-2.5 py-2 text-[11px] font-semibold transition ${entry.status === value ? statuses.find((item) => item.value === value)?.color : "text-slate-500 hover:bg-slate-50"}`}>{label}</button>)}</div> : <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statuses.find((item) => item.value === entry.status)?.color}`}>{statuses.find((item) => item.value === entry.status)?.label}</span>}</div>)}</div>}</section>;
}

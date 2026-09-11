"use client";

import { CalendarCheck2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { AttendanceEntry } from "@/lib/attendance-types";

const labels = { PRESENT: "Present", ABSENT: "Absent", LATE: "Late", EXCUSED: "Excused" };

export function AttendanceHistory({ studentId }: { studentId: string }) {
  const [history, setHistory] = useState<AttendanceEntry[]>([]);
  const [percentage, setPercentage] = useState(0);
  useEffect(() => { fetch(`/api/students/${studentId}/attendance`).then((response) => response.json()).then((data) => { setHistory(data.history ?? []); setPercentage(data.percentage ?? 0); }).catch(() => undefined); }, [studentId]);
  return <section className="mt-6 rounded-2xl border border-[#e3e9eb] bg-white p-5 shadow-[0_5px_20px_rgba(24,35,47,0.03)]"><div className="mb-5 flex items-center justify-between"><div><h2 className="font-semibold">Attendance history</h2><p className="mt-1 text-xs text-slate-500">Recent attendance record for this student</p></div><div className="text-right"><p className="text-2xl font-semibold text-[#1c5b4d]">{percentage}%</p><p className="text-[11px] text-slate-500">Attendance rate</p></div></div>{history.length ? <div className="divide-y divide-[#edf0f1]">{history.map((record) => <div key={record.id} className="flex items-center justify-between py-3"><div className="flex items-center gap-2"><CalendarCheck2 size={15} className="text-slate-400" /><span className="text-sm text-slate-600">{new Date(record.date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</span></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${record.status === "PRESENT" ? "bg-[#e4f1eb] text-[#26705b]" : record.status === "LATE" ? "bg-[#fff0df] text-[#bc6b38]" : record.status === "EXCUSED" ? "bg-[#e4edf5] text-[#46718d]" : "bg-[#fae7e4] text-[#b35d58]"}`}>{labels[record.status]}</span></div>)}</div> : <p className="py-5 text-center text-sm text-slate-500">No attendance history yet.</p>}</section>;
}

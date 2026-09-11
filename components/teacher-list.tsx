"use client";

import { BookOpen, Eye, MoreHorizontal, Pencil, UserCheck, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { StatCard } from "@/components/stat-card";
import type { Teacher } from "@/lib/teacher-types";

export function TeacherList() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("deleted") === "1" ? "Teacher deleted successfully." : "");

  useEffect(() => {
    fetch("/api/teachers").then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Teachers could not be loaded.");
      setTeachers(data.teachers);
    }).catch((loadError: Error) => setError(loadError.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="rounded-2xl border border-[#e3e9eb] bg-white p-10 text-center text-sm text-slate-500">Loading teachers...</div>;
  if (error) return <div role="alert" className="rounded-2xl border border-[#f0c9c4] bg-[#fff7f5] p-5 text-sm text-[#b35d58]">{error}</div>;

  return <div>{message && <p role="status" className="mb-5 rounded-xl border border-[#b8d7cd] bg-[#eaf4f0] px-4 py-3 text-sm font-medium text-[#26705b]">{message}</p>}<div className="mb-6 grid gap-4 sm:grid-cols-3"><StatCard label="Teaching staff" value={String(teachers.length)} detail="In the active directory" icon={Users} /><StatCard label="Contactable staff" value={String(teachers.filter((teacher) => teacher.email || teacher.phone).length)} detail="Phone or email on file" icon={UserCheck} tone="blue" /><StatCard label="Subjects covered" value={String(new Set(teachers.map((teacher) => teacher.subject)).size)} detail="Across current sample staff" icon={BookOpen} tone="orange" /></div><DataTable searchPlaceholder="Search by name, ID or subject" columns={[{ key: "teacher", label: "Teacher" }, { key: "subject", label: "Subject" }, { key: "contact", label: "Contact" }, { key: "action", label: "" }]} rows={teachers.map((teacher) => ({ id: teacher.id, _search: `${teacher.employeeId} ${teacher.firstName} ${teacher.lastName} ${teacher.subject} ${teacher.email ?? ""}`, teacher: <div><p className="font-semibold text-[#1b2e38]">{teacher.firstName} {teacher.lastName}</p><p className="mt-1 text-xs text-slate-400">{teacher.employeeId}</p></div>, subject: <span>{teacher.subject}</span>, contact: <div><p className="text-slate-600">{teacher.phone ?? "No phone"}</p><p className="mt-1 text-xs text-slate-400">{teacher.email ?? "No email"}</p></div>, action: <div className="flex items-center justify-end gap-1"><Link href={`/dashboard/teachers/${teacher.id}`} aria-label={`View ${teacher.firstName} ${teacher.lastName}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#1c5b4d]"><Eye size={16} /></Link><Link href={`/dashboard/teachers/${teacher.id}/edit`} aria-label={`Edit ${teacher.firstName} ${teacher.lastName}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#1c5b4d]"><Pencil size={16} /></Link><MoreHorizontal size={17} className="ml-1 text-slate-300" /></div> }))} /></div>;
}

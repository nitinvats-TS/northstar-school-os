"use client";

import { Eye, GraduationCap, MoreHorizontal, Pencil, UserCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { StatCard } from "@/components/stat-card";
import type { Student } from "@/lib/student-types";
import { canEditStudent } from "@/lib/auth";
import { useAuth } from "@/components/auth-provider";

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message] = useState(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("deleted") === "1" ? "Student deleted successfully." : "");
  const { user } = useAuth();

  useEffect(() => {
    fetch("/api/students")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message ?? "Students could not be loaded.");
        setStudents(data.students);
      })
      .catch((loadError: Error) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="rounded-2xl border border-[#e3e9eb] bg-white p-10 text-center text-sm text-slate-500">Loading students...</div>;
  if (error) return <div role="alert" className="rounded-2xl border border-[#f0c9c4] bg-[#fff7f5] p-5 text-sm text-[#b35d58]">{error}</div>;

  return <div>{message && <p role="status" className="mb-5 rounded-xl border border-[#b8d7cd] bg-[#eaf4f0] px-4 py-3 text-sm font-medium text-[#26705b]">{message}</p>}<div className="mb-6 grid gap-4 sm:grid-cols-3"><StatCard label="Total students" value={String(students.length)} detail="In the active directory" icon={GraduationCap} /><StatCard label="Active profiles" value={String(students.length)} detail="Ready for daily operations" icon={UserCheck} tone="blue" /><StatCard label="New this term" value="48" detail="12 awaiting documents" icon={UserPlus} tone="orange" /></div><DataTable searchPlaceholder="Search by name, ID or class" columns={[{ key: "student", label: "Student" }, { key: "grade", label: "Class" }, { key: "contact", label: "Contact" }, { key: "action", label: "" }]} rows={students.map((student) => ({ id: student.id, _search: `${student.admissionNo} ${student.firstName} ${student.lastName} ${student.email ?? ""} ${student.className} ${student.section}`, student: <div><p className="font-semibold text-[#1b2e38]">{student.firstName} {student.lastName}</p><p className="mt-1 text-xs text-slate-400">{student.admissionNo}</p></div>, grade: <span>Grade {student.className}{student.section}</span>, contact: <div><p className="text-slate-600">{student.phone ?? "No phone"}</p><p className="mt-1 text-xs text-slate-400">{student.email ?? "No email"}</p></div>, action: <div className="flex items-center justify-end gap-1"><Link href={`/dashboard/students/${student.id}`} aria-label={`View ${student.firstName} ${student.lastName}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#1c5b4d]"><Eye size={16} /></Link>{user && canEditStudent(user.role) && <Link href={`/dashboard/students/${student.id}/edit`} aria-label={`Edit ${student.firstName} ${student.lastName}`} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-[#1c5b4d]"><Pencil size={16} /></Link>}{user && canEditStudent(user.role) && <MoreHorizontal size={17} className="ml-1 text-slate-300" />}</div> }))} /></div>;
}

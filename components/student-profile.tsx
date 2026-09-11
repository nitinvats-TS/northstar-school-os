"use client";

import { ArrowLeft, CalendarDays, Edit3, Mail, Phone, Trash2, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { canDeleteStudent, canEditStudent } from "@/lib/auth";
import { useAuth } from "@/components/auth-provider";
import type { Student } from "@/lib/student-types";
import { AttendanceHistory } from "@/components/attendance-history";

export function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message] = useState(() => {
    if (typeof window === "undefined") return "";
    const query = new URLSearchParams(window.location.search);
    return query.get("created") === "1" ? "Student created successfully." : query.get("updated") === "1" ? "Student updated successfully." : "";
  });
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/students/${id}`).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Student could not be loaded.");
      setStudent(data.student);
    }).catch((loadError: Error) => setError(loadError.message)).finally(() => setLoading(false));
  }, [id]);

  async function removeStudent() {
    setDeleting(true);
    const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      setError(data.message ?? "Student could not be deleted.");
      setDeleting(false);
      setConfirming(false);
      return;
    }
    router.push("/dashboard/students?deleted=1");
    router.refresh();
  }

  if (loading) return <div className="rounded-2xl border border-[#e3e9eb] bg-white p-10 text-center text-sm text-slate-500">Loading student profile...</div>;
  if (error || !student) return <div><Link href="/dashboard/students" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1c5b4d]"><ArrowLeft size={16} />Back to students</Link><div role="alert" className="rounded-2xl border border-[#f0c9c4] bg-[#fff7f5] p-5 text-sm text-[#b35d58]">{error || "Student not found."}</div></div>;

  return <div>
    {message && <p role="status" className="mb-5 rounded-xl border border-[#b8d7cd] bg-[#eaf4f0] px-4 py-3 text-sm font-medium text-[#26705b]">{message}</p>}
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <Link href="/dashboard/students" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1c5b4d]"><ArrowLeft size={16} />Back to students</Link>
      <div className="flex gap-2">
        {user && canEditStudent(user.role) && <Link href={`/dashboard/students/${student.id}/edit`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce4e6] bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><Edit3 size={15} />Edit</Link>}
        {user && canDeleteStudent(user.role) && <button onClick={() => setConfirming(true)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#efc4bf] bg-white px-3 text-sm font-semibold text-[#b35d58] hover:bg-[#fff7f5]"><Trash2 size={15} />Delete</button>}
      </div>
    </div>
    <section className="overflow-hidden rounded-2xl border border-[#e3e9eb] bg-white shadow-[0_5px_20px_rgba(24,35,47,0.03)]">
      <div className="bg-[#102a36] p-6 text-white md:p-8"><div className="flex items-center gap-4"><div className="grid size-16 place-items-center rounded-2xl bg-[#d9ece6] text-xl font-bold text-[#1c5b4d]">{student.firstName[0]}{student.lastName[0]}</div><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f3c17f]">{student.admissionNo}</p><h1 className="mt-1 text-2xl font-semibold">{student.firstName} {student.lastName}</h1><p className="mt-1 text-sm text-slate-300">Grade {student.className}{student.section} · Active student</p></div></div></div>
      <div className="grid gap-5 p-6 md:grid-cols-3 md:p-8"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#e4edf5] text-[#46718d]"><UserRound size={17} /></span><div><p className="text-xs text-slate-500">Class</p><p className="mt-1 text-sm font-semibold">Grade {student.className}{student.section}</p></div></div><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#e4f1eb] text-[#26705b]"><Phone size={17} /></span><div><p className="text-xs text-slate-500">Phone</p><p className="mt-1 text-sm font-semibold">{student.phone ?? "Not provided"}</p></div></div><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#fff0df] text-[#bc6b38]"><Mail size={17} /></span><div><p className="text-xs text-slate-500">Email</p><p className="mt-1 break-all text-sm font-semibold">{student.email ?? "Not provided"}</p></div></div></div>
      <div className="border-t border-[#edf0f1] px-6 py-4 text-xs text-slate-500 md:px-8"><CalendarDays size={14} className="mr-1 inline" /> Profile created {new Date(student.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</div>
    </section><AttendanceHistory studentId={student.id} />
    {confirming && <div className="fixed inset-0 z-50 grid place-items-center bg-[#102a36]/50 p-5"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold">Delete student?</h2><p className="mt-2 text-sm leading-6 text-slate-500">This will permanently remove {student.firstName} {student.lastName} from the student directory.</p></div><button onClick={() => setConfirming(false)} aria-label="Close delete confirmation" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div><div className="mt-6 flex justify-end gap-3"><button onClick={() => setConfirming(false)} className="rounded-xl border border-[#dce4e6] px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button disabled={deleting} onClick={removeStudent} className="rounded-xl bg-[#b35d58] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70">{deleting ? "Deleting..." : "Delete student"}</button></div></div></div>}
  </div>;
}

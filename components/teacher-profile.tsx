"use client";

import { ArrowLeft, CalendarDays, Edit3, Mail, Phone, Trash2, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Teacher } from "@/lib/teacher-types";

export function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message] = useState(() => {
    if (typeof window === "undefined") return "";
    const query = new URLSearchParams(window.location.search);
    return query.get("created") === "1" ? "Teacher created successfully." : query.get("updated") === "1" ? "Teacher updated successfully." : "";
  });
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/teachers/${id}`).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Teacher could not be loaded.");
      setTeacher(data.teacher);
    }).catch((loadError: Error) => setError(loadError.message)).finally(() => setLoading(false));
  }, [id]);

  async function removeTeacher() {
    setDeleting(true);
    const response = await fetch(`/api/teachers/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json();
      setError(data.message ?? "Teacher could not be deleted.");
      setDeleting(false);
      setConfirming(false);
      return;
    }
    router.push("/dashboard/teachers?deleted=1");
    router.refresh();
  }

  if (loading) return <div className="rounded-2xl border border-[#e3e9eb] bg-white p-10 text-center text-sm text-slate-500">Loading teacher profile...</div>;
  if (error || !teacher) return <div><Link href="/dashboard/teachers" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1c5b4d]"><ArrowLeft size={16} />Back to teachers</Link><div role="alert" className="rounded-2xl border border-[#f0c9c4] bg-[#fff7f5] p-5 text-sm text-[#b35d58]">{error || "Teacher not found."}</div></div>;

  return <div>{message && <p role="status" className="mb-5 rounded-xl border border-[#b8d7cd] bg-[#eaf4f0] px-4 py-3 text-sm font-medium text-[#26705b]">{message}</p>}<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><Link href="/dashboard/teachers" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1c5b4d]"><ArrowLeft size={16} />Back to teachers</Link><div className="flex gap-2"><Link href={`/dashboard/teachers/${teacher.id}/edit`} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce4e6] bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><Edit3 size={15} />Edit</Link><button onClick={() => setConfirming(true)} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#efc4bf] bg-white px-3 text-sm font-semibold text-[#b35d58] hover:bg-[#fff7f5]"><Trash2 size={15} />Delete</button></div></div><section className="overflow-hidden rounded-2xl border border-[#e3e9eb] bg-white shadow-[0_5px_20px_rgba(24,35,47,0.03)]"><div className="bg-[#102a36] p-6 text-white md:p-8"><div className="flex items-center gap-4"><div className="grid size-16 place-items-center rounded-2xl bg-[#d9ece6] text-xl font-bold text-[#1c5b4d]">{teacher.firstName[0]}{teacher.lastName[0]}</div><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f3c17f]">{teacher.employeeId}</p><h1 className="mt-1 text-2xl font-semibold">{teacher.firstName} {teacher.lastName}</h1><p className="mt-1 text-sm text-slate-300">{teacher.subject} · Teaching staff</p></div></div></div><div className="grid gap-5 p-6 md:grid-cols-3 md:p-8"><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#e4edf5] text-[#46718d]"><UserRound size={17} /></span><div><p className="text-xs text-slate-500">Primary subject</p><p className="mt-1 text-sm font-semibold">{teacher.subject}</p></div></div><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#e4f1eb] text-[#26705b]"><Phone size={17} /></span><div><p className="text-xs text-slate-500">Phone</p><p className="mt-1 text-sm font-semibold">{teacher.phone ?? "Not provided"}</p></div></div><div className="flex items-start gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#fff0df] text-[#bc6b38]"><Mail size={17} /></span><div><p className="text-xs text-slate-500">Email</p><p className="mt-1 break-all text-sm font-semibold">{teacher.email ?? "Not provided"}</p></div></div></div><div className="border-t border-[#edf0f1] px-6 py-4 text-xs text-slate-500 md:px-8"><CalendarDays size={14} className="mr-1 inline" /> Profile created {new Date(teacher.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</div></section>{confirming && <div className="fixed inset-0 z-50 grid place-items-center bg-[#102a36]/50 p-5"><div role="dialog" aria-modal="true" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold">Delete teacher?</h2><p className="mt-2 text-sm leading-6 text-slate-500">This will permanently remove {teacher.firstName} {teacher.lastName} from the staff directory.</p></div><button onClick={() => setConfirming(false)} aria-label="Close delete confirmation" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X size={18} /></button></div><div className="mt-6 flex justify-end gap-3"><button onClick={() => setConfirming(false)} className="rounded-xl border border-[#dce4e6] px-4 py-2.5 text-sm font-semibold text-slate-600">Cancel</button><button disabled={deleting} onClick={removeTeacher} className="rounded-xl bg-[#b35d58] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70">{deleting ? "Deleting..." : "Delete teacher"}</button></div></div></div>}</div>;
}

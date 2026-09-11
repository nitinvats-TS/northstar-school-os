"use client";

import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import type { Teacher, TeacherFieldErrors, TeacherInput } from "@/lib/teacher-types";

type FormMode = "create" | "edit";
const emptyForm: TeacherInput = { employeeId: "", firstName: "", lastName: "", subject: "", phone: "", email: "" };

export function TeacherForm({ mode, teacherId }: { mode: FormMode; teacherId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState<TeacherInput>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<TeacherFieldErrors>({});
  const [pageError, setPageError] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== "edit" || !teacherId) return;
    fetch(`/api/teachers/${teacherId}`).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Teacher could not be loaded.");
      const teacher = data.teacher as Teacher;
      setForm({ employeeId: teacher.employeeId, firstName: teacher.firstName, lastName: teacher.lastName, subject: teacher.subject, phone: teacher.phone ?? "", email: teacher.email ?? "" });
    }).catch((error: Error) => setPageError(error.message)).finally(() => setLoading(false));
  }, [mode, teacherId]);

  function updateField(field: keyof TeacherInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setPageError("");
    setFieldErrors({});
    const response = await fetch(mode === "create" ? "/api/teachers" : `/api/teachers/${teacherId}`, { method: mode === "create" ? "POST" : "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await response.json();
    if (!response.ok) {
      setPageError(data.message ?? "Unable to save teacher.");
      setFieldErrors(data.fieldErrors ?? {});
      setSaving(false);
      return;
    }
    router.push(`/dashboard/teachers/${data.teacher.id}?${mode === "create" ? "created=1" : "updated=1"}`);
    router.refresh();
  }

  if (loading) return <div className="rounded-2xl border border-[#e3e9eb] bg-white p-10 text-center text-sm text-slate-500">Loading teacher profile...</div>;
  if (pageError && mode === "edit" && !form.firstName) return <div className="rounded-2xl border border-[#f0c9c4] bg-[#fff7f5] p-5 text-sm text-[#b35d58]">{pageError}</div>;

  const fields: { key: keyof TeacherInput; label: string; placeholder: string; type?: string }[] = [
    { key: "firstName", label: "First name", placeholder: "Vikram" },
    { key: "lastName", label: "Last name", placeholder: "Singh" },
    { key: "employeeId", label: "Employee ID", placeholder: "TC046" },
    { key: "subject", label: "Primary subject", placeholder: "Mathematics" },
    { key: "phone", label: "Phone number", placeholder: "9876543210", type: "tel" },
    { key: "email", label: "Email address", placeholder: "teacher@northstar.edu", type: "email" },
  ];

  return <form onSubmit={submit} className="rounded-2xl border border-[#e3e9eb] bg-white p-5 shadow-[0_5px_20px_rgba(24,35,47,0.03)] md:p-7"><div className="mb-6 border-b border-[#edf0f1] pb-5"><h2 className="font-semibold">Teacher information</h2><p className="mt-1 text-xs text-slate-500">Keep the staff directory details accurate and easy to contact.</p></div>{pageError && <p role="alert" className="mb-5 rounded-xl bg-[#fae7e4] px-3 py-2.5 text-sm text-[#b35d58]">{pageError}</p>}<div className="grid gap-5 sm:grid-cols-2">{fields.map(({ key, label, placeholder, type }) => <label key={key} className="block text-xs font-semibold text-slate-600">{label}<input required={key !== "phone" && key !== "email"} type={type ?? "text"} value={form[key] ?? ""} onChange={(event) => updateField(key, event.target.value)} placeholder={placeholder} className={`mt-2 h-11 w-full rounded-xl border px-3 text-sm font-normal outline-none focus:border-[#6ea99a] focus:ring-2 focus:ring-[#d9ece6] ${fieldErrors[key] ? "border-[#d78379]" : "border-[#dce4e6]"}`} />{fieldErrors[key] && <span className="mt-1 block text-[11px] font-medium text-[#b35d58]">{fieldErrors[key]}</span>}</label>)}</div><div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#edf0f1] pt-5 sm:flex-row sm:justify-between"><Link href={mode === "edit" && teacherId ? `/dashboard/teachers/${teacherId}` : "/dashboard/teachers"} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#dce4e6] px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"><ArrowLeft size={16} />Cancel</Link><button disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#1c5b4d] px-5 text-sm font-semibold text-white disabled:opacity-70">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{saving ? "Saving..." : mode === "create" ? "Add teacher" : "Save changes"}</button></div></form>;
}

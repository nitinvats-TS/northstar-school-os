"use client";

import { Mail, MessageCircle, MoreHorizontal, Phone, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { StatCard } from "@/components/stat-card";
import type { Parent } from "@/lib/parent-types";

export function ParentList() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/parents").then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Parents could not be loaded.");
      setParents(data.parents);
    }).catch((loadError: Error) => setError(loadError.message)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="rounded-2xl border border-[#e3e9eb] bg-white p-10 text-center text-sm text-slate-500">Loading parents...</div>;
  if (error) return <div role="alert" className="rounded-2xl border border-[#f0c9c4] bg-[#fff7f5] p-5 text-sm text-[#b35d58]">{error}</div>;

  return <div><div className="mb-6 grid gap-4 sm:grid-cols-3"><StatCard label="Parent accounts" value={String(parents.length)} detail="In the active directory" icon={Users} /><StatCard label="Contactable families" value={String(parents.filter((parent) => parent.email || parent.phone).length)} detail="Phone or email on file" icon={Phone} tone="blue" /><StatCard label="Messages this month" value="842" detail="Communication activity" icon={MessageCircle} tone="orange" /></div><DataTable searchPlaceholder="Search by name or email" columns={[{ key: "parent", label: "Parent / guardian" }, { key: "contact", label: "Contact" }, { key: "status", label: "Profile" }, { key: "action", label: "" }]} rows={parents.map((parent) => ({ id: parent.id, _search: `${parent.firstName} ${parent.lastName} ${parent.email ?? ""} ${parent.phone}`, parent: <div><p className="font-semibold text-[#1b2e38]">{parent.firstName} {parent.lastName}</p><p className="mt-1 text-xs text-slate-400">Parent account</p></div>, contact: <div><p className="flex items-center gap-1 text-slate-600"><Phone size={13} />{parent.phone}</p><p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><Mail size={12} />{parent.email ?? "No email"}</p></div>, status: <span className="rounded-full bg-[#e4f1eb] px-2.5 py-1 text-[11px] font-semibold text-[#26705b]">Verified</span>, action: <MoreHorizontal size={18} className="text-slate-400" /> }))} /></div>;
}

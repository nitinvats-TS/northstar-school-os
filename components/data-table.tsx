"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

type Column = { key: string; label: string };
type Row = Record<string, React.ReactNode> & { _search?: string };

export function DataTable({ columns, rows, searchPlaceholder = "Search records...", filterLabel = "Filter" }: { columns: Column[]; rows: Row[]; searchPlaceholder?: string; filterLabel?: string }) {
  const [query, setQuery] = useState("");
  const filteredRows = useMemo(() => rows.filter((row) => (row._search ?? Object.values(row).join(" ")).toLowerCase().includes(query.toLowerCase())), [query, rows]);
  return <div className="overflow-hidden rounded-2xl border border-[#e3e9eb] bg-white shadow-[0_5px_20px_rgba(24,35,47,0.03)]"><div className="flex flex-col gap-3 border-b border-[#edf0f1] p-4 sm:flex-row sm:items-center sm:justify-between"><div className="relative w-full sm:max-w-xs"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} className="h-10 w-full rounded-xl border border-[#dce4e6] bg-[#fbfcfc] pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#6ea99a] focus:ring-2 focus:ring-[#d9ece6]" /></div><button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dce4e6] px-3 text-sm font-medium text-slate-600 hover:bg-slate-50"><SlidersHorizontal size={15} />{filterLabel}</button></div><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead className="bg-[#fafbfb] text-[11px] uppercase tracking-[0.12em] text-slate-500"><tr>{columns.map((column) => <th key={column.key} className="px-5 py-3.5 font-semibold">{column.label}</th>)}</tr></thead><tbody className="divide-y divide-[#edf0f1]">{filteredRows.map((row, index) => <tr key={String(row.id ?? index)} className="transition hover:bg-[#fbfdfc]">{columns.map((column) => <td key={column.key} className="px-5 py-4 text-slate-600">{row[column.key]}</td>)}</tr>)}</tbody></table></div>{filteredRows.length === 0 && <p className="px-5 py-10 text-center text-sm text-slate-500">No records match your search.</p>}<div className="border-t border-[#edf0f1] px-5 py-3 text-xs text-slate-500">Showing {filteredRows.length} of {rows.length} records</div></div>;
}

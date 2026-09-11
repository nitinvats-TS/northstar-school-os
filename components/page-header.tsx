import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";

export function PageHeader({ eyebrow, title, description, action, href }: { eyebrow?: string; title: string; description: string; action?: string; href?: string }) {
  return <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#d4774f]">{eyebrow ?? "School operations"}</p><h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#142531] md:text-[34px]">{title}</h1><p className="mt-2 text-sm text-slate-500">{description}</p></div>{action && <Link href={href ?? "#"} className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1c5b4d] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#15483d]"><Plus size={17} />{action}<ArrowUpRight size={15} /></Link>}</div>;
}

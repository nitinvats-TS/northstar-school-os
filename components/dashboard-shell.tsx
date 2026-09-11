"use client";

import {
  BarChart3,
  BookOpen,
  CalendarCheck2,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  WalletCards,
  CalendarDays,
  Megaphone,
  FileBarChart,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { canAccess, roleLabels } from "@/lib/auth";
import { useAuth } from "@/components/auth-provider";

const navigation = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Students", href: "/dashboard/students", icon: GraduationCap },
  { label: "Teachers", href: "/dashboard/teachers", icon: Users },
  { label: "Parents", href: "/dashboard/parents", icon: Users },
  { label: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck2 },
  { label: "Fees & billing", href: "/dashboard/fees", icon: WalletCards },
  { label: "Exams", href: "/dashboard/exams", icon: BookOpen },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Timetable", href: "/dashboard/timetable", icon: CalendarDays },
  { label: "Announcements", href: "/dashboard/announcements", icon: Megaphone },
  { label: "Reports", href: "/dashboard/reports", icon: FileBarChart },
  { label: "Parent portal", href: "/dashboard/portal/parent", icon: Users },
  { label: "Student portal", href: "/dashboard/portal/student", icon: GraduationCap },
  { label: "Teacher portal", href: "/dashboard/portal/teacher", icon: Users },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const visibleNavigation = navigation.filter((item) => user && canAccess(user.role, item.href));

  return (
    <div className="min-h-screen bg-[#f5f7f9] text-[#18232f]">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#102a36] px-5 py-6 text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-2">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid size-10 place-items-center rounded-xl bg-[#f3a44b] text-[#102a36]"><GraduationCap size={23} strokeWidth={2.5} /></span>
            <span><strong className="block text-[15px] tracking-wide">Northstar</strong><span className="text-xs text-slate-300">School OS</span></span>
          </Link>
          <button className="rounded-lg p-1 text-slate-300 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation"><X size={20} /></button>
        </div>
        <p className="mb-3 mt-10 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p>
        <nav className="space-y-1">
          {visibleNavigation.map(({ label, href, icon: Icon }) => {
            const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active ? "bg-[#e7f2ed] text-[#1c5b4d]" : "text-slate-300 hover:bg-white/10 hover:text-white"}`}><Icon size={18} /><span>{label}</span></Link>;
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-white/10 p-4">
          <div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold text-slate-200">Academic year</span><ChevronDown size={15} className="text-slate-400" /></div>
          <p className="text-sm font-semibold">2024 - 2025</p><p className="mt-1 text-xs text-slate-400">Term 2 is in progress</p>
        </div>
      </aside>
      {open && <button className="fixed inset-0 z-30 bg-[#102a36]/50 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" />}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#e2e8eb] bg-[#f5f7f9]/95 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-3"><button className="rounded-lg p-2 hover:bg-white lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><div className="hidden items-center gap-2 text-sm text-slate-500 sm:flex"><span>Northstar Academy</span><span>/</span><span className="font-medium text-slate-700">Admin portal</span></div></div>
          <div className="flex items-center gap-3"><button className="relative grid size-9 place-items-center rounded-full border border-[#dbe3e5] bg-white text-slate-500" aria-label="Notifications"><span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-[#e17855]" /><BarChart3 size={17} /></button><div className="flex items-center gap-2 border-l border-[#dbe3e5] pl-3"><div className="grid size-9 place-items-center rounded-full bg-[#d9ece6] text-sm font-bold text-[#1c5b4d]">{user?.name.slice(0, 2).toUpperCase() ?? "NS"}</div><div className="hidden sm:block"><p className="text-xs font-semibold">{user?.name ?? "Northstar user"}</p><p className="text-[11px] text-slate-500">{user ? roleLabels[user.role] : "Loading session"}</p></div><button onClick={logout} className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-[#1c5b4d]" aria-label="Sign out"><LogOut size={16} /></button></div></div>
        </header>
        <main className="mx-auto max-w-[1500px] p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}

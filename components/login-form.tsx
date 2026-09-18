"use client";

import { ArrowRight, Eye, EyeOff, KeyRound, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { demoUsers, getDefaultRoute, roleLabels } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("director@northstar.edu");
  const [password, setPassword] = useState("director123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json().catch(() => ({ success: false, message: "The authentication service returned an invalid response." }));
      console.log("LOGIN RESPONSE", data);
      if (!response.ok || data.success !== true) {
        setError(data.message ?? "Unable to sign in.");
        return;
      }
            router.refresh();
            window.location.href = getDefaultRoute(data.user.role);
            //router.push(getDefaultRoute(data.user.role));
    } catch {
      setError("Unable to reach the authentication service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function selectDemoAccount(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  }

  return <div><form onSubmit={handleSubmit} className="mt-8 space-y-5"><label className="block text-xs font-semibold text-slate-600">Work email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@northstar.edu" className="mt-2 h-12 w-full rounded-xl border border-[#dce4e6] px-3 text-sm outline-none focus:border-[#6ea99a] focus:ring-2 focus:ring-[#d9ece6]" /></label><label className="block text-xs font-semibold text-slate-600">Password<div className="relative mt-2"><input required type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="h-12 w-full rounded-xl border border-[#dce4e6] px-3 pr-11 text-sm outline-none focus:border-[#6ea99a] focus:ring-2 focus:ring-[#d9ece6]" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>{error && <p role="alert" className="rounded-xl bg-[#fae7e4] px-3 py-2 text-xs font-medium text-[#b35d58]">{error}</p>}<button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1c5b4d] text-sm font-semibold text-white transition hover:bg-[#15483d] disabled:cursor-wait disabled:opacity-70">{loading ? <Loader2 size={16} className="animate-spin" /> : <><span>Continue to dashboard</span><ArrowRight size={16} /></>}</button></form><div className="mt-7 border-t border-[#edf0f1] pt-5"><p className="flex items-center gap-2 text-xs font-semibold text-slate-600"><KeyRound size={14} /> Try a demo role</p><div className="mt-3 grid grid-cols-2 gap-2">{demoUsers.map((demo) => <button key={demo.role} type="button" onClick={() => selectDemoAccount(demo.email, demo.password)} className={`rounded-xl border px-3 py-2 text-left text-xs transition ${email === demo.email ? "border-[#9ac9bb] bg-[#eaf4f0] text-[#1c5b4d]" : "border-[#dce4e6] text-slate-600 hover:bg-slate-50"}`}><span className="block font-semibold">{roleLabels[demo.role]}</span><span className="mt-1 block truncate text-[10px] text-slate-400">{demo.email}</span></button>)}</div></div></div>;
}

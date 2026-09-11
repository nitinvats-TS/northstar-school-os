import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { canAccess, decodeSession, SESSION_COOKIE } from "@/lib/auth";
import { listParents } from "@/lib/parent-store";

export async function GET() {
  const cookieStore = await cookies();
  const user = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!user || !canAccess(user.role, "/dashboard/parents")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ parents: await listParents() });
}

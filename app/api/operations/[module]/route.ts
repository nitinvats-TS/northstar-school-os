import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth";
import { getOperations, listOperationModules, type OperationModule } from "@/lib/operations-store";

function canAccessOperation(role: string, operation: OperationModule) {
  if (role === "SUPER_ADMIN" || role === "DIRECTOR") return true;
  const allowed: Record<string, OperationModule[]> = {
    FRONT_OFFICE: ["fees"],
    TEACHER: ["exams", "timetable", "teacher-portal"],
    PARENT: ["fees", "parent-portal"],
    STUDENT: ["exams", "timetable", "student-portal"],
  };
  return allowed[role]?.includes(operation) ?? false;
}

export async function GET(_request: Request, { params }: { params: Promise<{ module: string }> }) {
  const cookieStore = await cookies();
  const user = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
  const operation = (await params).module as OperationModule;
  if (!user || !listOperationModules().includes(operation) || !canAccessOperation(user.role, operation)) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  return NextResponse.json({ success: true, module: operation, data: getOperations(operation) });
}

export async function POST(request: Request, { params }: { params: Promise<{ module: string }> }) {
  const cookieStore = await cookies();
  const user = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
  const operation = (await params).module as OperationModule;
  if (!user || !listOperationModules().includes(operation) || !canAccessOperation(user.role, operation)) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  if (!["SUPER_ADMIN", "DIRECTOR", "FRONT_OFFICE", "TEACHER"].includes(user.role)) return NextResponse.json({ success: false, message: "You do not have permission to modify this module." }, { status: 403 });
  const body = await request.json().catch(() => null);
  return NextResponse.json({ success: true, message: "Change saved for MVP review.", payload: body });
}

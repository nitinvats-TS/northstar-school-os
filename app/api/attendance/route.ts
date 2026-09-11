import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { canAccess, decodeSession, getOwnStudentAdmissionNo, SESSION_COOKIE } from "@/lib/auth";
import { canMarkSubject, teacherAssignedClasses } from "@/lib/attendance-permissions";
import type { AttendanceInput, AttendanceSubject } from "@/lib/attendance-types";
import { listAttendance, saveAttendance } from "@/lib/attendance-store";
import { listStudents } from "@/lib/student-store";

async function getUser() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

function validSubject(value: string | null): value is AttendanceSubject {
  return value === "student" || value === "teacher";
}

export async function GET(request: Request) {
  const user = await getUser();
  const url = new URL(request.url);
  const subject = url.searchParams.get("subject") ?? "student";
  const date = url.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const className = url.searchParams.get("className") ?? undefined;
  if (!user || !validSubject(subject) || !canAccess(user.role, "/dashboard/attendance")) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  if (user.role === "TEACHER" && subject === "student" && className && !teacherAssignedClasses(user.email).includes(className)) return NextResponse.json({ success: false, message: "You can only view assigned classes." }, { status: 403 });
  if (user.role === "TEACHER" && subject === "teacher") return NextResponse.json({ success: false, message: "Teachers cannot manage teacher attendance." }, { status: 403 });
  let entries = await listAttendance(date, subject, className);
  const ownAdmissionNo = getOwnStudentAdmissionNo(user.role);
  if (ownAdmissionNo && subject === "student") entries = entries.filter((entry) => entry.personId === "student_aarav");
  return NextResponse.json({ success: true, date, subject, entries });
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  const body = await request.json().catch(() => null) as { date?: string; subject?: string; className?: string; entries?: AttendanceInput[] } | null;
  const subject = body?.subject ?? null;
  const date = body?.date ?? new Date().toISOString().slice(0, 10);
  if (!validSubject(subject) || !Array.isArray(body?.entries) || !canMarkSubject(user.role, subject)) return NextResponse.json({ success: false, message: "You do not have permission to mark this attendance." }, { status: 403 });
  if (user.role === "TEACHER" && (!body.className || !teacherAssignedClasses(user.email).includes(body.className))) return NextResponse.json({ success: false, message: "You can only mark attendance for assigned classes." }, { status: 403 });
  if (user.role === "TEACHER" && subject === "student") {
    const students = await listStudents();
    const allowed = students.filter((student) => `${student.className}${student.section}` === body.className).map((student) => student.id);
    if (body.entries.some((entry) => !allowed.includes(entry.personId))) return NextResponse.json({ success: false, message: "One or more students are outside your assigned class." }, { status: 403 });
  }
  const records = await Promise.all(body.entries.map((entry) => saveAttendance(date, subject, entry, user.id)));
  return NextResponse.json({ success: true, records });
}

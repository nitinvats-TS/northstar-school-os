import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { canAccess, decodeSession, SESSION_COOKIE } from "@/lib/auth";
import { createTeacher, listTeachers } from "@/lib/teacher-store";
import { validateTeacherInput } from "@/lib/teacher-validation";

async function getUser() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

function canManage(role: string) {
  return role === "SUPER_ADMIN" || role === "DIRECTOR" || role === "FRONT_OFFICE";
}

export async function GET() {
  const user = await getUser();
  if (!user || !canAccess(user.role, "/dashboard/teachers")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ teachers: await listTeachers() });
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user || !canManage(user.role)) return NextResponse.json({ message: "You do not have permission to add teachers." }, { status: 403 });
  const validation = validateTeacherInput(await request.json().catch(() => null));
  if (validation.errors) return NextResponse.json({ message: "Please correct the highlighted fields.", fieldErrors: validation.errors }, { status: 400 });
  if ((await listTeachers()).some((teacher) => teacher.employeeId === validation.data?.employeeId)) return NextResponse.json({ message: "That employee ID is already in use.", fieldErrors: { employeeId: "Employee ID must be unique." } }, { status: 409 });
  return NextResponse.json({ teacher: await createTeacher(validation.data!) }, { status: 201 });
}

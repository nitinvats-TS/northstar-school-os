import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { canAccess, decodeSession, SESSION_COOKIE } from "@/lib/auth";
import { deleteTeacher, getTeacher, listTeachers, updateTeacher } from "@/lib/teacher-store";
import { validateTeacherInput } from "@/lib/teacher-validation";

async function getUser() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

function canManage(role: string) {
  return role === "SUPER_ADMIN" || role === "DIRECTOR" || role === "FRONT_OFFICE";
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user || !canAccess(user.role, "/dashboard/teachers")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const teacher = await getTeacher((await params).id);
  return teacher ? NextResponse.json({ teacher }) : NextResponse.json({ message: "Teacher not found." }, { status: 404 });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user || !canManage(user.role)) return NextResponse.json({ message: "You do not have permission to edit teachers." }, { status: 403 });
  const id = (await params).id;
  if (!(await getTeacher(id))) return NextResponse.json({ message: "Teacher not found." }, { status: 404 });
  const validation = validateTeacherInput(await request.json().catch(() => null));
  if (validation.errors) return NextResponse.json({ message: "Please correct the highlighted fields.", fieldErrors: validation.errors }, { status: 400 });
  if ((await listTeachers()).some((teacher) => teacher.id !== id && teacher.employeeId === validation.data?.employeeId)) return NextResponse.json({ message: "That employee ID is already in use.", fieldErrors: { employeeId: "Employee ID must be unique." } }, { status: 409 });
  return NextResponse.json({ teacher: await updateTeacher(id, validation.data!) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user || !canManage(user.role)) return NextResponse.json({ message: "You do not have permission to delete teachers." }, { status: 403 });
  const deleted = await deleteTeacher((await params).id);
  return deleted ? NextResponse.json({ success: true }) : NextResponse.json({ message: "Teacher not found." }, { status: 404 });
}

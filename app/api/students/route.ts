import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { canAccess, canCreateStudent, decodeSession, getOwnStudentAdmissionNo, SESSION_COOKIE } from "@/lib/auth";
import { createStudent, listStudents } from "@/lib/student-store";
import { validateStudentInput } from "@/lib/student-validation";

async function getUser() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function GET() {
  const user = await getUser();
  if (!user || !canAccess(user.role, "/dashboard/students")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const students = await listStudents();
  const ownAdmissionNo = getOwnStudentAdmissionNo(user.role);
  return NextResponse.json({ students: ownAdmissionNo ? students.filter((student) => student.admissionNo === ownAdmissionNo) : students });
}

export async function POST(request: Request) {
  const user = await getUser();
  if (!user || !canCreateStudent(user.role)) return NextResponse.json({ message: "You do not have permission to add students." }, { status: 403 });
  const validation = validateStudentInput(await request.json().catch(() => null));
  if (validation.errors) return NextResponse.json({ message: "Please correct the highlighted fields.", fieldErrors: validation.errors }, { status: 400 });
  const duplicate = (await listStudents()).some((student) => student.admissionNo === validation.data?.admissionNo);
  if (duplicate) return NextResponse.json({ message: "That admission number is already in use.", fieldErrors: { admissionNo: "Admission number must be unique." } }, { status: 409 });
  try {
    return NextResponse.json({ student: await createStudent(validation.data!) }, { status: 201 });
  } catch (error) {
    console.error("Student create Prisma error:", error);
    return NextResponse.json({ message: "Student could not be created in PostgreSQL.", error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

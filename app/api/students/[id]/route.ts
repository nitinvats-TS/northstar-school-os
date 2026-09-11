import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { canAccess, canDeleteStudent, canEditStudent, decodeSession, getOwnStudentAdmissionNo, SESSION_COOKIE } from "@/lib/auth";
import { deleteStudent, getStudent, listStudents, updateStudent } from "@/lib/student-store";
import { validateStudentInput } from "@/lib/student-validation";

async function getUser() {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user || !canAccess(user.role, "/dashboard/students")) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const student = await getStudent((await params).id);
  if (!student) return NextResponse.json({ message: "Student not found." }, { status: 404 });
  const ownAdmissionNo = getOwnStudentAdmissionNo(user.role);
  if (ownAdmissionNo && student.admissionNo !== ownAdmissionNo) return NextResponse.json({ message: "You can only view your own student profile." }, { status: 403 });
  return NextResponse.json({ student });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user || !canEditStudent(user.role)) return NextResponse.json({ message: "You do not have permission to edit students." }, { status: 403 });
  const id = (await params).id;
  const existingStudent = await getStudent(id);
  if (!existingStudent) return NextResponse.json({ message: "Student not found." }, { status: 404 });
  const validation = validateStudentInput(await request.json().catch(() => null));
  if (validation.errors) return NextResponse.json({ message: "Please correct the highlighted fields.", fieldErrors: validation.errors }, { status: 400 });
  const duplicate = (await listStudents()).some((student) => student.id !== id && student.admissionNo === validation.data?.admissionNo);
  if (duplicate) return NextResponse.json({ message: "That admission number is already in use.", fieldErrors: { admissionNo: "Admission number must be unique." } }, { status: 409 });
  try {
    return NextResponse.json({ student: await updateStudent(id, validation.data!) });
  } catch (error) {
    console.error("Student update Prisma error:", error);
    return NextResponse.json({ message: "Student could not be updated in PostgreSQL.", error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getUser();
  if (!user || !canDeleteStudent(user.role)) return NextResponse.json({ message: "You do not have permission to delete students." }, { status: 403 });
  try {
    const deleted = await deleteStudent((await params).id);
    return deleted ? NextResponse.json({ success: true }) : NextResponse.json({ message: "Student not found." }, { status: 404 });
  } catch (error) {
    console.error("Student delete Prisma error:", error);
    return NextResponse.json({ message: "Student could not be deleted from PostgreSQL.", error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}

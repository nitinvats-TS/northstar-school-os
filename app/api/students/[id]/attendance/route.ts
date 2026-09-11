import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decodeSession, getOwnStudentAdmissionNo, SESSION_COOKIE } from "@/lib/auth";
import { getAttendanceHistory } from "@/lib/attendance-store";
import { getStudent } from "@/lib/student-store";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const user = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
  if (!user) return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
  const id = (await params).id;
  const student = await getStudent(id);
  if (!student) return NextResponse.json({ success: false, message: "Student not found." }, { status: 404 });
  if (getOwnStudentAdmissionNo(user.role) && student.admissionNo !== getOwnStudentAdmissionNo(user.role)) return NextResponse.json({ success: false, message: "You can only view your own attendance." }, { status: 403 });
  const history = await getAttendanceHistory(id, "student");
  const attended = history.filter((record) => record.status === "PRESENT" || record.status === "LATE").length;
  return NextResponse.json({ success: true, history, percentage: history.length ? Math.round((attended / history.length) * 1000) / 10 : 0 });
}

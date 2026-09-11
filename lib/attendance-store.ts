import { prisma } from "@/lib/prisma";
import type { AttendanceEntry, AttendanceInput, AttendanceStatus, AttendanceSubject } from "@/lib/attendance-types";
import type { Student } from "@/lib/student-types";
import type { Teacher } from "@/lib/teacher-types";

const today = () => new Date().toISOString().slice(0, 10);
const fallbackRecords: Array<AttendanceEntry> = [
  { id: "att_aarav_today", date: today(), status: "PRESENT", note: null, studentId: "student_aarav", teacherId: null, markedBy: "usr_director", personId: "student_aarav", name: "Aarav Mehta", className: "8", section: "A" },
  { id: "att_riya_today", date: today(), status: "PRESENT", note: null, studentId: "student_riya", teacherId: null, markedBy: "usr_director", personId: "student_riya", name: "Riya Kapoor", className: "10", section: "B" },
  { id: "att_kabir_today", date: today(), status: "ABSENT", note: "Parent notified", studentId: "student_kabir", teacherId: null, markedBy: "usr_director", personId: "student_kabir", name: "Kabir Shah", className: "6", section: "C" },
  { id: "att_myra_today", date: today(), status: "LATE", note: null, studentId: "student_myra", teacherId: null, markedBy: "usr_director", personId: "student_myra", name: "Myra Joseph", className: "9", section: "A" },
  { id: "att_vikram_today", date: today(), status: "PRESENT", note: null, studentId: null, teacherId: "teacher_vikram", markedBy: "usr_director", personId: "teacher_vikram", name: "Vikram Singh", subject: "Mathematics" },
  { id: "att_ishita_today", date: today(), status: "PRESENT", note: null, studentId: null, teacherId: "teacher_ishita", markedBy: "usr_director", personId: "teacher_ishita", name: "Ishita Verma", subject: "English Literature" },
];
const globalForAttendance = globalThis as typeof globalThis & { northstarAttendance?: Array<AttendanceEntry> };
const memory = globalForAttendance.northstarAttendance ?? structuredClone(fallbackRecords);
globalForAttendance.northstarAttendance = memory;

function formatDate(date: Date | string) { return typeof date === "string" ? date.slice(0, 10) : date.toISOString().slice(0, 10); }
function studentEntry(student: Pick<Student, "id" | "firstName" | "lastName" | "className" | "section">, record: { id: string; date: Date | string; status: AttendanceStatus; note: string | null; studentId: string | null; teacherId: string | null; markedBy: string | null }): AttendanceEntry { return { ...record, date: formatDate(record.date), personId: student.id, name: `${student.firstName} ${student.lastName}`, className: student.className, section: student.section }; }
function teacherEntry(teacher: Pick<Teacher, "id" | "firstName" | "lastName" | "subject">, record: { id: string; date: Date | string; status: AttendanceStatus; note: string | null; studentId: string | null; teacherId: string | null; markedBy: string | null }): AttendanceEntry { return { ...record, date: formatDate(record.date), personId: teacher.id, name: `${teacher.firstName} ${teacher.lastName}`, subject: teacher.subject }; }

export async function listAttendance(date: string, subject: AttendanceSubject, className?: string) {
  try {
    const records = await prisma.attendanceRecord.findMany({ where: { date: new Date(`${date}T00:00:00.000Z`), ...(subject === "student" ? { studentId: { not: null } } : { teacherId: { not: null } }), ...(className && subject === "student" ? { student: { className } } : {}) }, include: { student: true, teacher: true }, orderBy: { createdAt: "asc" } });
    return records.flatMap((record) => record.student ? [studentEntry(record.student, record)] : record.teacher ? [teacherEntry(record.teacher, record)] : []);
  } catch (error) {
    console.warn("PostgreSQL unavailable for attendance; using in-memory storage.", error instanceof Error ? error.message : error);
    return memory.filter((record) => record.date === date && (subject === "student" ? Boolean(record.studentId) : Boolean(record.teacherId)) && (!className || `${record.className}${record.section}` === className));
  }
}

export async function getAttendanceHistory(personId: string, subject: AttendanceSubject) {
  try {
    const records = await prisma.attendanceRecord.findMany({ where: subject === "student" ? { studentId: personId } : { teacherId: personId }, orderBy: { date: "desc" }, include: { student: true, teacher: true } });
    return records.flatMap((record) => record.student ? [studentEntry(record.student, record)] : record.teacher ? [teacherEntry(record.teacher, record)] : []);
  } catch (error) {
    console.warn("PostgreSQL unavailable for attendance history; using in-memory storage.", error instanceof Error ? error.message : error);
    return memory.filter((record) => record.personId === personId && (subject === "student" ? Boolean(record.studentId) : Boolean(record.teacherId))).sort((first, second) => second.date.localeCompare(first.date));
  }
}

export async function saveAttendance(date: string, subject: AttendanceSubject, input: AttendanceInput, markedBy: string) {
  try {
    const where = subject === "student" ? { date_studentId: { date: new Date(`${date}T00:00:00.000Z`), studentId: input.personId } } : { date_teacherId: { date: new Date(`${date}T00:00:00.000Z`), teacherId: input.personId } };
    const data = subject === "student" ? { date: new Date(`${date}T00:00:00.000Z`), studentId: input.personId, teacherId: null, status: input.status, note: input.note ?? null, markedBy } : { date: new Date(`${date}T00:00:00.000Z`), studentId: null, teacherId: input.personId, status: input.status, note: input.note ?? null, markedBy };
    const record = await prisma.attendanceRecord.upsert({ where, update: { status: input.status, note: input.note ?? null, markedBy }, create: data, include: { student: true, teacher: true } });
    return record.student ? studentEntry(record.student, record) : record.teacher ? teacherEntry(record.teacher, record) : null;
  } catch (error) {
    console.warn("PostgreSQL unavailable for attendance save; using in-memory storage.", error instanceof Error ? error.message : error);
    const existing = memory.find((record) => record.date === date && record.personId === input.personId);
    if (existing) { existing.status = input.status; existing.note = input.note ?? null; existing.markedBy = markedBy; return existing; }
    const record: AttendanceEntry = { id: `att_${crypto.randomUUID()}`, date, status: input.status, note: input.note ?? null, markedBy, studentId: subject === "student" ? input.personId : null, teacherId: subject === "teacher" ? input.personId : null, personId: input.personId, name: "Attendance record" };
    memory.push(record);
    return record;
  }
}

import { prisma } from "@/lib/prisma";
import type { Student, StudentInput } from "@/lib/student-types";

const fallbackSeed: Student[] = [
  { id: "student_aarav", admissionNo: "ST001", firstName: "Aarav", lastName: "Mehta", className: "8", section: "A", phone: "9876543210", email: "aarav.mehta@email.com", createdAt: "2025-04-01T08:00:00.000Z" },
  { id: "student_riya", admissionNo: "ST002", firstName: "Riya", lastName: "Kapoor", className: "10", section: "B", phone: "9876543211", email: "riya.kapoor@email.com", createdAt: "2025-04-01T08:00:00.000Z" },
  { id: "student_kabir", admissionNo: "ST003", firstName: "Kabir", lastName: "Shah", className: "6", section: "C", phone: "9876543212", email: "kabir.shah@email.com", createdAt: "2025-04-01T08:00:00.000Z" },
  { id: "student_myra", admissionNo: "ST004", firstName: "Myra", lastName: "Joseph", className: "9", section: "A", phone: "9876543213", email: "myra.joseph@email.com", createdAt: "2025-04-01T08:00:00.000Z" },
];

type FallbackStore = { students: Student[] };
const globalForStudents = globalThis as typeof globalThis & { northstarStudentFallback?: FallbackStore };
const fallbackStore = globalForStudents.northstarStudentFallback ?? { students: structuredClone(fallbackSeed) };
globalForStudents.northstarStudentFallback = fallbackStore;

function serializeStudent(student: { id: string; admissionNo: string; firstName: string; lastName: string; className: string; section: string; phone: string | null; email: string | null; createdAt: Date }): Student {
  return { ...student, createdAt: student.createdAt.toISOString() };
}

function sortedFallbackStudents() {
  return [...fallbackStore.students].sort((first, second) => `${first.lastName}${first.firstName}`.localeCompare(`${second.lastName}${second.firstName}`));
}

function isDatabaseError(error: unknown) {
  return error instanceof Error;
}

export async function listStudents() {
  try {
    const students = await prisma.student.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] });
    return students.map(serializeStudent);
  } catch (error) {
    console.warn("PostgreSQL unavailable for students; using in-memory storage.", isDatabaseError(error) ? error.message : error);
    return sortedFallbackStudents();
  }
}

export async function getStudent(id: string) {
  try {
    const student = await prisma.student.findUnique({ where: { id } });
    return student ? serializeStudent(student) : null;
  } catch (error) {
    console.warn("PostgreSQL unavailable for student detail; using in-memory storage.", isDatabaseError(error) ? error.message : error);
    return fallbackStore.students.find((student) => student.id === id) ?? null;
  }
}

export async function createStudent(input: StudentInput) {
  return serializeStudent(await prisma.student.create({ data: input }));
}

export async function updateStudent(id: string, input: StudentInput) {
  return serializeStudent(await prisma.student.update({ where: { id }, data: input }));
}

export async function deleteStudent(id: string) {
  await prisma.student.delete({ where: { id } });
  return true;
}

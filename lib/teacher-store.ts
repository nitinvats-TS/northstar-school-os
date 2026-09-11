import { prisma } from "@/lib/prisma";
import type { Teacher, TeacherInput } from "@/lib/teacher-types";

type PrismaTeacher = Awaited<ReturnType<typeof prisma.teacher.findUnique>>;

function serializeTeacher(teacher: PrismaTeacher): Teacher | null {
  if (!teacher) return null;
  return { ...teacher, phone: teacher.phone, email: teacher.email, createdAt: teacher.createdAt.toISOString() };
}

export async function listTeachers() {
  const teachers = await prisma.teacher.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] });
  return teachers.map((teacher) => serializeTeacher(teacher)!);
}

export async function getTeacher(id: string) {
  return serializeTeacher(await prisma.teacher.findUnique({ where: { id } }));
}

export async function createTeacher(input: TeacherInput) {
  return serializeTeacher(await prisma.teacher.create({ data: input }))!;
}

export async function updateTeacher(id: string, input: TeacherInput) {
  return serializeTeacher(await prisma.teacher.update({ where: { id }, data: input }));
}

export async function deleteTeacher(id: string) {
  try {
    await prisma.teacher.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}

import type { Role } from "@/lib/auth";
import type { AttendanceSubject } from "@/lib/attendance-types";

export function canViewAttendance() {
  return true;
}

export function canEditAttendance(role: Role) {
  return role === "SUPER_ADMIN" || role === "DIRECTOR" || role === "FRONT_OFFICE" || role === "TEACHER";
}

export function canMarkSubject(role: Role, subject: AttendanceSubject) {
  if (role === "SUPER_ADMIN" || role === "DIRECTOR" || role === "FRONT_OFFICE") return true;
  return role === "TEACHER" && subject === "student";
}

export function teacherAssignedClasses(email: string) {
  return email === "teacher@northstar.edu" ? ["8A", "9B", "10A"] : [];
}

export function ownAttendanceAdmissionNo(role: Role) {
  return role === "PARENT" || role === "STUDENT" ? "ST001" : null;
}

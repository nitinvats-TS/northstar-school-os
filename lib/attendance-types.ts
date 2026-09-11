export const attendanceStatuses = ["PRESENT", "ABSENT", "LATE", "EXCUSED"] as const;
export type AttendanceStatus = (typeof attendanceStatuses)[number];
export type AttendanceSubject = "student" | "teacher";

export type AttendanceRecord = {
  id: string;
  date: string;
  status: AttendanceStatus;
  note: string | null;
  studentId: string | null;
  teacherId: string | null;
  markedBy: string | null;
};

export type AttendanceEntry = AttendanceRecord & {
  personId: string;
  name: string;
  className?: string;
  section?: string;
  subject?: string;
};

export type AttendanceInput = {
  personId: string;
  status: AttendanceStatus;
  note?: string;
};

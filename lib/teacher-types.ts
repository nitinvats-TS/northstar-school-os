export type Teacher = {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  subject: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
};

export type TeacherInput = Omit<Teacher, "id" | "createdAt">;
export type TeacherFieldErrors = Partial<Record<keyof TeacherInput, string>>;

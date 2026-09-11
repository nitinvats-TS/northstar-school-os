export type Student = {
  id: string;
  admissionNo: string;
  firstName: string;
  lastName: string;
  className: string;
  section: string;
  phone: string | null;
  email: string | null;
  createdAt: string;
};

export type StudentInput = Omit<Student, "id" | "createdAt">;

export type StudentFieldErrors = Partial<Record<keyof StudentInput, string>>;

import type { TeacherFieldErrors, TeacherInput } from "@/lib/teacher-types";

export function validateTeacherInput(value: unknown): { data?: TeacherInput; errors?: TeacherFieldErrors } {
  const body = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const data: TeacherInput = {
    employeeId: typeof body.employeeId === "string" ? body.employeeId.trim().toUpperCase() : "",
    firstName: typeof body.firstName === "string" ? body.firstName.trim() : "",
    lastName: typeof body.lastName === "string" ? body.lastName.trim() : "",
    subject: typeof body.subject === "string" ? body.subject.trim() : "",
    phone: typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : null,
    email: typeof body.email === "string" && body.email.trim() ? body.email.trim().toLowerCase() : null,
  };
  const errors: TeacherFieldErrors = {};
  if (!data.employeeId) errors.employeeId = "Employee ID is required.";
  else if (!/^TC\d{3,}$/.test(data.employeeId)) errors.employeeId = "Use the format TC001 or higher.";
  if (!data.firstName) errors.firstName = "First name is required.";
  else if (data.firstName.length < 2) errors.firstName = "First name must be at least 2 characters.";
  if (!data.lastName) errors.lastName = "Last name is required.";
  if (!data.subject) errors.subject = "Subject is required.";
  if (data.phone && !/^[0-9 +()-]{8,20}$/.test(data.phone)) errors.phone = "Enter a valid phone number.";
  if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) errors.email = "Enter a valid email address.";
  return Object.keys(errors).length ? { errors } : { data };
}

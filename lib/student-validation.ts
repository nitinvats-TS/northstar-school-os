import type { StudentFieldErrors, StudentInput } from "@/lib/student-types";

export function validateStudentInput(value: unknown): { data?: StudentInput; errors?: StudentFieldErrors } {
  const body = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const data: StudentInput = {
    admissionNo: typeof body.admissionNo === "string" ? body.admissionNo.trim().toUpperCase() : "",
    firstName: typeof body.firstName === "string" ? body.firstName.trim() : "",
    lastName: typeof body.lastName === "string" ? body.lastName.trim() : "",
    className: typeof body.className === "string" ? body.className.trim() : "",
    section: typeof body.section === "string" ? body.section.trim().toUpperCase() : "",
    phone: typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : null,
    email: typeof body.email === "string" && body.email.trim() ? body.email.trim().toLowerCase() : null,
  };
  const errors: StudentFieldErrors = {};
  if (!data.admissionNo) errors.admissionNo = "Admission number is required.";
  else if (!/^ST\d{3,}$/.test(data.admissionNo)) errors.admissionNo = "Use the format ST001 or higher.";
  if (!data.firstName) errors.firstName = "First name is required.";
  else if (data.firstName.length < 2) errors.firstName = "First name must be at least 2 characters.";
  if (!data.lastName) errors.lastName = "Last name is required.";
  if (!data.className) errors.className = "Class is required.";
  else if (!/^(?:[1-9]|1[0-2])$/.test(data.className)) errors.className = "Enter a class from 1 to 12.";
  if (!data.section) errors.section = "Section is required.";
  else if (!/^[A-Z]$/.test(data.section)) errors.section = "Use one section letter, such as A.";
  if (data.phone && !/^[0-9 +()-]{8,20}$/.test(data.phone)) errors.phone = "Enter a valid phone number.";
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Enter a valid email address.";
  return Object.keys(errors).length ? { errors } : { data };
}

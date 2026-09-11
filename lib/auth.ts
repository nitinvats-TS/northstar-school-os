export const roles = [
  "SUPER_ADMIN",
  "DIRECTOR",
  "FRONT_OFFICE",
  "TEACHER",
  "STUDENT",
  "PARENT",
] as const;

export type Role = (typeof roles)[number];

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type DemoUser = SessionUser & {
  password: string;
};

export const demoUsers: DemoUser[] = [
  { id: "usr_super_admin", name: "Maya Patel", email: "admin@northstar.edu", password: "admin123", role: "SUPER_ADMIN" },
  { id: "usr_director", name: "Ananya Rao", email: "director@northstar.edu", password: "director123", role: "DIRECTOR" },
  { id: "usr_front_office", name: "Neha Joshi", email: "office@northstar.edu", password: "office123", role: "FRONT_OFFICE" },
  { id: "usr_teacher", name: "Vikram Singh", email: "teacher@northstar.edu", password: "teacher123", role: "TEACHER" },
  { id: "usr_student", name: "Aarav Mehta", email: "student@northstar.edu", password: "student123", role: "STUDENT" },
  { id: "usr_parent", name: "Nisha Mehta", email: "parent@northstar.edu", password: "parent123", role: "PARENT" },
];

export const roleLabels: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  DIRECTOR: "Director",
  FRONT_OFFICE: "Front Office",
  TEACHER: "Teacher",
  STUDENT: "Student",
  PARENT: "Parent",
};

const roleRoutes: Record<Role, string[]> = {
  SUPER_ADMIN: ["/dashboard"],
  DIRECTOR: ["/dashboard"],
  FRONT_OFFICE: ["/dashboard", "/dashboard/students", "/dashboard/parents", "/dashboard/attendance", "/dashboard/fees"],
  TEACHER: ["/dashboard", "/dashboard/students", "/dashboard/attendance", "/dashboard/exams"],
  STUDENT: ["/dashboard", "/dashboard/students", "/dashboard/attendance", "/dashboard/exams"],
  PARENT: ["/dashboard", "/dashboard/students", "/dashboard/attendance", "/dashboard/fees"],
};

export function isRole(value: string | undefined): value is Role {
  return roles.includes(value as Role);
}

export function canAccess(role: Role, pathname: string) {
  if (role === "SUPER_ADMIN" || role === "DIRECTOR") return pathname.startsWith("/dashboard");
  return roleRoutes[role].some((route) => route === "/dashboard" ? pathname === route : pathname.startsWith(route));
}

export function canViewStudentList(role: Role) {
  return ["SUPER_ADMIN", "DIRECTOR", "FRONT_OFFICE", "TEACHER"].includes(role);
}

export function canCreateStudent(role: Role) {
  return role === "SUPER_ADMIN" || role === "DIRECTOR" || role === "FRONT_OFFICE";
}

export function canEditStudent(role: Role) {
  return role === "SUPER_ADMIN" || role === "DIRECTOR" || role === "FRONT_OFFICE";
}

export function canDeleteStudent(role: Role) {
  return role === "SUPER_ADMIN" || role === "DIRECTOR";
}

export function isStudentEditPath(pathname: string) {
  return pathname === "/dashboard/students/new" || pathname.includes("/dashboard/students/") && pathname.endsWith("/edit");
}

export function getOwnStudentAdmissionNo(role: Role) {
  return role === "PARENT" || role === "STUDENT" ? "ST001" : null;
}

export function getDefaultRoute(role: Role) {
  const defaultRoutes: Record<Role, string> = {
    SUPER_ADMIN: "/dashboard",
    DIRECTOR: "/dashboard",
    FRONT_OFFICE: "/dashboard",
    TEACHER: "/dashboard",
    STUDENT: "/dashboard",
    PARENT: "/dashboard",
  };
  return defaultRoutes[role];
}

export function toSessionUser(user: DemoUser): SessionUser {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function encodeSession(user: SessionUser) {
  return btoa(JSON.stringify(user));
}

export function decodeSession(value: string | undefined): SessionUser | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(atob(value)) as Partial<SessionUser>;
    if (!parsed.id || !parsed.name || !parsed.email || !isRole(parsed.role)) return null;
    return { id: parsed.id, name: parsed.name, email: parsed.email, role: parsed.role };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "northstar_session";

import { demoUsers, type DemoUser, type Role } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function findUserByCredentials(email: string, password: string): Promise<DemoUser | { id: string; email: string; password: string; role: Role } | null> {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const databaseUser = await prisma.user.findFirst({ where: { email: normalizedEmail, password } });
    if (databaseUser) return databaseUser;
  } catch (error) {
    console.warn("PostgreSQL unavailable during login; using MVP demo users.", error instanceof Error ? error.message : error);
  }

  return demoUsers.find((user) => user.email === normalizedEmail && user.password === password) ?? null;
}

export function toSessionUser(user: { id: string; email: string; role: Role }) {
  const name = user.email.split("@")[0].split(/[._-]/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  return { id: user.id, name, email: user.email, role: user.role };
}

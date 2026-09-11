import { prisma } from "@/lib/prisma";
import type { Parent } from "@/lib/parent-types";

export async function listParents(): Promise<Parent[]> {
  const parents = await prisma.parent.findMany({ orderBy: [{ lastName: "asc" }, { firstName: "asc" }] });
  return parents.map((parent) => ({ ...parent, createdAt: parent.createdAt.toISOString() }));
}

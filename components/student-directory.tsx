"use client";

import { PageHeader } from "@/components/page-header";
import { StudentList } from "@/components/student-list";
import { canCreateStudent } from "@/lib/auth";
import { useAuth } from "@/components/auth-provider";

export function StudentDirectory() {
  const { user } = useAuth();
  return <div><PageHeader eyebrow="People directory" title="Students" description="Manage student profiles, enrollment and class assignments." action={user && canCreateStudent(user.role) ? "Add student" : undefined} href="/dashboard/students/new" /><StudentList /></div>;
}

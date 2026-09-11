import { PageHeader } from "@/components/page-header";
import { StudentForm } from "@/components/student-form";

export default async function EditStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="mx-auto max-w-3xl"><PageHeader eyebrow="People directory / Students" title="Edit student" description="Update the student profile and keep the directory accurate." /><StudentForm mode="edit" studentId={id} /></div>;
}

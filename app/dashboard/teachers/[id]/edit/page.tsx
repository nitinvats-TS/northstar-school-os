import { PageHeader } from "@/components/page-header";
import { TeacherForm } from "@/components/teacher-form";

export default async function EditTeacherPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="mx-auto max-w-3xl"><PageHeader eyebrow="People directory / Teachers" title="Edit teacher" description="Update the staff profile and keep the directory accurate." /><TeacherForm mode="edit" teacherId={id} /></div>;
}

import { PageHeader } from "@/components/page-header";
import { TeacherForm } from "@/components/teacher-form";

export default function NewTeacherPage() {
  return <div className="mx-auto max-w-3xl"><PageHeader eyebrow="People directory / Teachers" title="Add teacher" description="Create a staff profile with their subject and contact details." /><TeacherForm mode="create" /></div>;
}

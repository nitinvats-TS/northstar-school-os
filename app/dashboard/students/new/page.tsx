import { PageHeader } from "@/components/page-header";
import { StudentForm } from "@/components/student-form";

export default function NewStudentPage() {
  return <div className="mx-auto max-w-3xl"><PageHeader eyebrow="People directory / Students" title="Add student" description="Create a student profile with their current class and contact details." /><StudentForm mode="create" /></div>;
}

import { PageHeader } from "@/components/page-header";
import { TeacherList } from "@/components/teacher-list";

export default function TeachersPage() {
  return <div><PageHeader eyebrow="People directory" title="Teachers" description="Keep your teaching team, subjects and contact details organized." action="Add teacher" href="/dashboard/teachers/new" /><TeacherList /></div>;
}

import { PageHeader } from "@/components/page-header";
import { ParentList } from "@/components/parent-list";

export default function ParentsPage() { return <div><PageHeader eyebrow="People directory" title="Parents & guardians" description="Manage family contacts and keep communication details up to date." action="Add parent" /><ParentList /></div>; }

import StudentPageClient from "@/components/pages/StudentPage";

export default async function StudentPage({ params }: { params: Promise<{ rollNo: string }> }) {
  const { rollNo } = await params;
  return <StudentPageClient rollNo={rollNo} />;
}

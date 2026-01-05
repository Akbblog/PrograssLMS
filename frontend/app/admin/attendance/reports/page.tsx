import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import Link from "next/link";

export default function AttendanceReportsPage() {
  return (
    <AdminPageLayout title="Attendance Reports" description="View and export attendance reporting">
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <p className="text-sm text-slate-600">
          Attendance reporting is available in the reports section.
        </p>
        <div className="flex gap-3">
          <Link
            href="/admin/reports"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Go to Reports
          </Link>
          <Link
            href="/admin/attendance"
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium"
          >
            Back to Attendance
          </Link>
        </div>
      </div>
    </AdminPageLayout>
  );
}

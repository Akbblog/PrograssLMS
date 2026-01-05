import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import Link from "next/link";

export default function TransportReportsPage() {
  return (
    <AdminPageLayout title="Transport Reports" description="View transport usage and route performance">
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <p className="text-sm text-slate-600">Transport reports are coming soon.</p>
        <Link
          href="/admin/transport"
          className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium"
        >
          Back to Transport
        </Link>
      </div>
    </AdminPageLayout>
  );
}

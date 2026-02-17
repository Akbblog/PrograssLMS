"use client";

import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import BulkCardsForm from "@/components/admin/BulkCardsForm";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Palette } from "lucide-react";

export default function BulkPrintPage() {
  const router = useRouter();

  return (
    <AdminPageLayout
      title="Bulk Print ID Cards"
      description="Generate and download ID cards in bulk using the active template"
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/card-designer")}
        >
          <Palette className="w-4 h-4 mr-1" /> Customize Template
        </Button>
      }
    >
      <BulkCardsForm />
    </AdminPageLayout>
  );
}

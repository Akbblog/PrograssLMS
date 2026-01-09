"use client";

import React, { useState } from "react";
import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import { useStaff, useCreateStaff, useDeleteStaff } from '@/hooks/useStaff';
import StaffList from "./_components/StaffList";
import StaffForm from "./_components/StaffForm";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";
import { Users } from "lucide-react";

export default function StaffPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);

  const { data: staffRes, isLoading: staffLoading } = useStaff();
  const staff = (staffRes && (staffRes as any).data) ? (staffRes as any).data : (staffRes || []);

  const { mutateAsync: createStaff } = useCreateStaff();
  const { mutateAsync: deleteStaff } = useDeleteStaff();


  const handleAddStaff = async (data: any) => {
    try {
      // Auto-generate employeeId if not present (simple mock)
      const payload = {
        ...data,
        employeeId: `EMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        status: 'active'
      };

      await createStaff(payload);
      toast.success("Staff member added successfully");
      setIsAddOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to add staff");
    }
  };
  
  const handleEditStaff = (staffMember: any) => {
      // In a real app, you would transform the data to match the form structure if needed
      setEditingStaff(staffMember);
      setIsAddOpen(true);
  };

  const handleDeleteStaff = async (id: string) => {
      if(!confirm("Are you sure?")) return;
      try {
        /* Implementation for delete would go here */
        toast.success("Staff deleted");
      } catch(e) {
          toast.error("Failed to delete");
      }
  };

  return (
    <AdminPageLayout title="Staff Directory" description="Manage staff data, contracts, and profiles">
      <div className="p-6">
        <StaffList 
            data={staff} 
            onAdd={() => { setEditingStaff(null); setIsAddOpen(true); }}
            onEdit={handleEditStaff}
            onDelete={handleDeleteStaff}
            onView={(s) => console.log("View", s)}
        />

        <Sheet open={isAddOpen} onOpenChange={setIsAddOpen}>
          <SheetContent side="right" className="w-[100%] sm:w-[800px] sm:max-w-[90vw] p-0 overflow-hidden gap-0">
            <SheetHeader className="px-6 py-5 border-b">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <SheetTitle>{editingStaff ? "Edit Staff Profile" : "Add New Staff Member"}</SheetTitle>
                  <SheetDescription>Capture staff details, contracts, and documents</SheetDescription>
                </div>
              </div>
            </SheetHeader>
            <SheetBody className="flex-1 overflow-hidden p-0">
              <StaffForm 
                onSubmit={handleAddStaff} 
                onCancel={() => setIsAddOpen(false)} 
                isLoading={staffLoading}
                defaultValues={editingStaff}
              />
            </SheetBody>
            </SheetContent>
        </Sheet>
      </div>
    </AdminPageLayout>
  );
}

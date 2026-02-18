"use client";

import React, { useState } from "react";
import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import { useStaff, useCreateStaff, useDeleteStaff } from '@/hooks/useStaff';
import { adminAPI, hrAPI } from '@/lib/api/endpoints';
import { useQueryClient } from '@tanstack/react-query';
import StaffList from "./_components/StaffList";
import StaffForm from "./_components/StaffForm";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { Users } from "lucide-react";

export default function StaffPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: staffRes, isLoading: staffLoading } = useStaff();
  const staff = (staffRes && (staffRes as any).data) ? (staffRes as any).data : (staffRes || []);

  const { mutateAsync: createStaff } = useCreateStaff();
  const { mutateAsync: deleteStaff } = useDeleteStaff();
  const qc = useQueryClient();


  const handleAddStaff = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (!editingStaff) {
        const payload = {
          ...data,
          employeeId: data.employeeId || `EMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
          status: data.status || 'active'
        };
        await createStaff(payload);
        toast.success("Staff member added successfully");
      } else if (editingStaff._source === 'teacher') {
        const firstName = data.personalInfo?.firstName || '';
        const lastName = data.personalInfo?.lastName || '';
        const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

        const teacherPayload = {
          name: fullName || editingStaff.raw?.name || editingStaff.personalInfo?.firstName || '',
          email: data.contactInfo?.email || editingStaff.contactInfo?.email || undefined,
          phone: data.contactInfo?.phone || editingStaff.contactInfo?.phone || undefined,
          avatar: data.personalInfo?.photo || null,
          personalInfoPhoto: data.personalInfo?.photo || null,
          documents: Array.isArray(data.documents) ? data.documents : [],
        };

        await adminAPI.updateTeacher(editingStaff._id, teacherPayload);
        toast.success("Teacher profile updated");
      } else {
        const payload = {
          ...data,
          employeeId: editingStaff.employeeId || data.employeeId || `EMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
          status: data.status || editingStaff.status || 'active'
        };
        await hrAPI.updateStaff(editingStaff._id, payload);
        toast.success("Staff profile updated");
      }
      qc.invalidateQueries(['staff']);
      qc.invalidateQueries(['teachers']);
      setEditingStaff(null);
      setIsAddOpen(false);
    } catch (error: any) {
      toast.error(error?.message || error?.response?.data?.message || "Failed to save staff profile");
    } finally {
      setIsSubmitting(false);
    }
  };
  
    const handleEditStaff = (staffMember: any) => {
      setEditingStaff(staffMember);
      setIsAddOpen(true);
    };

  const handleDeleteStaff = async (id: string) => {
      if(!confirm("Are you sure?")) return;
      try {
        await deleteStaff(id);
        toast.success("Staff deleted");
      } catch(e: any) {
          toast.error(e?.response?.data?.message || e.message || "Failed to delete");
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

        <Sheet open={isAddOpen} onOpenChange={(open) => {
          setIsAddOpen(open);
          if (!open) setEditingStaff(null);
        }}>
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
                onCancel={() => { setIsAddOpen(false); setEditingStaff(null); }} 
                isLoading={isSubmitting || staffLoading}
                defaultValues={editingStaff}
              />
            </SheetBody>
            </SheetContent>
        </Sheet>
      </div>
    </AdminPageLayout>
  );
}

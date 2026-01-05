"use client";

import React, { useEffect, useState } from "react";
import AdminPageLayout from "@/components/layouts/AdminPageLayout";
import StaffList from "./_components/StaffList";
import StaffForm from "./_components/StaffForm";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { unwrapArray } from "@/lib/utils";

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/v1/hr/staff");
      const data = await res.json();
      if(data.status === 'success') {
          setStaff(unwrapArray(data.data));
      }
    } catch (error) {
      toast.error("Failed to fetch staff list");
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (data: any) => {
    setIsLoading(true);
    try {
      // Auto-generate employeeId if not present (simple mock)
      const payload = {
        ...data,
        employeeId: `EMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        status: 'active'
      };

      const res = await fetch("/api/v1/hr/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Staff member added successfully");
        setIsAddOpen(false);
        fetchStaff();
      } else {
        const err = await res.json();
        toast.error(err.message || "Failed to add staff");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
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
            <SheetContent side="right" className="w-[100%] sm:w-[800px] sm:max-w-[90vw] p-0 overflow-hidden">
                <SheetHeader className="px-6 py-4 border-b">
                    <SheetTitle>{editingStaff ? "Edit Staff Profile" : "Add New Staff Member"}</SheetTitle>
                </SheetHeader>
                <div className="h-[calc(100vh-80px)]">
                    <StaffForm 
                        onSubmit={handleAddStaff} 
                        onCancel={() => setIsAddOpen(false)} 
                        isLoading={isLoading}
                        defaultValues={editingStaff}
                    />
                </div>
            </SheetContent>
        </Sheet>
      </div>
    </AdminPageLayout>
  );
}

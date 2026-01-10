"use client";

import React, { useState } from "react";
import { unwrapArray } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  LayoutGrid, 
  List,
  Eye,
  Pencil,
  Trash2,
  Mail,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface StaffMember {
  _id: string;
  employeeId: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    photo?: string;
  };
  contactInfo: {
    email: string;
    phone: string;
  };
  employmentInfo: {
    department: string;
    designation: string;
    status: string;
  };
  _source?: string;
  status: string;
}

interface StaffListProps {
  data: StaffMember[];
  onEdit: (staff: StaffMember) => void;
  onDelete: (id: string) => void;
  onView: (staff: StaffMember) => void;
  onAdd: () => void;
}

export default function StaffList({ data, onEdit, onDelete, onView, onAdd }: StaffListProps) {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const safeData = unwrapArray<StaffMember>(data);

  const filteredData = safeData.filter((staff) => {
    const matchesSearch =
      staff.personalInfo?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.personalInfo?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.contactInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === "all" || staff.employmentInfo?.department === deptFilter;
    const matchesStatus = statusFilter === "all" || staff.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 hover:bg-green-100/80";
      case "on_leave": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80";
      case "suspended": return "bg-red-100 text-red-700 hover:bg-red-100/80";
      default: return "bg-gray-100 text-gray-700 hover:bg-gray-100/80";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 rounded-xl shadow-sm">
            <div className="text-sm font-medium text-muted-foreground">Total Staff</div>
            <div className="text-2xl font-bold">{safeData.length}</div>
        </Card>
        <Card className="p-6 rounded-xl shadow-sm">
            <div className="text-sm font-medium text-muted-foreground">Active</div>
            <div className="text-2xl font-bold text-green-600">{safeData.filter(s => s.status === 'active').length}</div>
        </Card>
        <Card className="p-6 rounded-xl shadow-sm">
            <div className="text-sm font-medium text-muted-foreground">On Leave</div>
            <div className="text-2xl font-bold text-yellow-600">{safeData.filter(s => s.status === 'on_leave').length}</div>
        </Card>
         <Card className="p-6 rounded-xl shadow-sm">
            <div className="text-sm font-medium text-muted-foreground">New This Month</div>
            <div className="text-2xl font-bold text-blue-600">0</div>
        </Card>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff..."
              className="pl-8 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[150px] h-10">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depts</SelectItem>
              <SelectItem value="teaching">Teaching</SelectItem>
              <SelectItem value="administration">Admin</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="management">Management</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on_leave">On Leave</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
            <div className="border rounded-md flex p-1 bg-muted/20">
                <Button 
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setViewMode('grid')}
                >
                    <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                    variant={viewMode === 'table' ? 'secondary' : 'ghost'} 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setViewMode('table')}
                >
                    <List className="h-4 w-4" />
                </Button>
            </div>
            <Button variant="outline" className="h-10 gap-2">
                <Upload className="h-4 w-4" /> Import
            </Button>
            <Button variant="outline" className="h-10 gap-2">
                <Download className="h-4 w-4" /> Export
            </Button>
            <Button className="h-10 gap-2 bg-primary hover:bg-primary/90" onClick={onAdd}>
                <Plus className="h-4 w-4" /> Add Staff
            </Button>
        </div>
      </div>

      {/* Data View */}
      {viewMode === "table" ? (
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader className="bg-gray-50 uppercase text-xs">
              <TableRow>
                <TableHead className="w-[80px]">Photo</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                          No staff members found.
                      </TableCell>
                  </TableRow>
              ) : (
                  filteredData.map((staff) => (
                    <TableRow key={staff._id} className="h-[52px]">
                      <TableCell>
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={staff.personalInfo?.photo} />
                          <AvatarFallback>{staff.personalInfo?.firstName?.[0]}{staff.personalInfo?.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{staff.employeeId}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <span>{staff.personalInfo?.firstName} {staff.personalInfo?.lastName}</span>
                        {staff._source === 'teacher' && (
                          <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full">Teacher</Badge>
                        )}
                      </TableCell>
                      <TableCell className="capitalize">{staff.employmentInfo?.department}</TableCell>
                      <TableCell>{staff.employmentInfo?.designation}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-xs">
                            <span>{staff.contactInfo?.email}</span>
                            <span className="text-muted-foreground">{staff.contactInfo?.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`rounded-full shadow-none ${getStatusColor(staff.status)}`}>
                            {staff.status?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onView(staff)}>
                                <Eye className="h-4 w-4 text-gray-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(staff)}>
                                <Pencil className="h-4 w-4 text-blue-500" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => {}} className="gap-2">
                                        <Mail className="h-4 w-4" /> Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {}} className="gap-2">
                                        <FileText className="h-4 w-4" /> View Payslips
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onDelete(staff._id)} className="gap-2 text-red-600 focus:text-red-700">
                                        <Trash2 className="h-4 w-4" /> Delete Profile
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredData.map((staff) => (
                  <Card key={staff._id} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardContent className="p-0">
                          <div className="p-6 flex flex-col items-center border-b bg-gray-50/50">
                              <Avatar className="h-24 w-24 mb-4">
                                  <AvatarImage src={staff.personalInfo?.photo} />
                                  <AvatarFallback className="text-xl">{staff.personalInfo?.firstName?.[0]}{staff.personalInfo?.lastName?.[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-lg">{staff.personalInfo?.firstName} {staff.personalInfo?.lastName}</h3>
                                {staff._source === 'teacher' && (
                                  <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full">Teacher</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{staff.employmentInfo?.designation}</p>
                              <Badge className={`mt-2 rounded-full shadow-none ${getStatusColor(staff.status)}`}>
                                  {staff.status?.replace('_', ' ')}
                              </Badge>
                          </div>
                          <div className="p-4 space-y-2 text-sm">
                              <div className="flex justify-between">
                                  <span className="text-muted-foreground">Dept:</span>
                                  <span className="font-medium capitalize">{staff.employmentInfo?.department}</span>
                              </div>
                              <div className="flex justify-between">
                                  <span className="text-muted-foreground">ID:</span>
                                  <span className="font-medium">{staff.employeeId}</span>
                              </div>
                              <div className="flex justify-between">
                                  <span className="text-muted-foreground">Email:</span>
                                  <span className="font-medium truncate max-w-[150px]" title={staff.contactInfo?.email}>{staff.contactInfo?.email}</span>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
              ))}
          </div>
      )}
    </div>
  );
}

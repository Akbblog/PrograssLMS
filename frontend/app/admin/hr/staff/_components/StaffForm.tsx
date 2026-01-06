"use client";

import React, { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Check, ChevronsLeft, ChevronsRight, Upload, X, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Schema Definitions ---
const staffSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(2, "Required"),
    lastName: z.string().min(2, "Required"),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid Date"), // storing as string for input[type=date]
    gender: z.enum(["male", "female", "other"]),
    nationalId: z.string().min(1, "Required"),
    maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional(),
    photo: z.string().optional(),
  }),
  contactInfo: z.object({
    email: z.string().email("Invalid email"),
    phone: z.string().min(5, "Required"),
    alternatePhone: z.string().optional(),
    address: z.object({
      street: z.string().min(1, "Required"),
      city: z.string().min(1, "Required"),
      state: z.string().min(1, "Required"),
      postalCode: z.string().min(1, "Required"),
      country: z.string().min(1, "Required"),
    }),
    emergencyContact: z.object({
      name: z.string().min(1, "Required"),
      relationship: z.string().min(1, "Required"),
      phone: z.string().min(1, "Required"),
    }),
  }),
  employmentInfo: z.object({
    department: z.string().min(1, "Required"),
    designation: z.string().min(1, "Required"),
    employmentType: z.enum(["full-time", "part-time", "contract", "temporary"]),
    joiningDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid Date"),
    workLocation: z.string().optional(),
    shift: z.string().optional(),
  }),
  qualifications: z.array(z.object({
    degree: z.string().min(1, "Required"),
    institution: z.string().min(1, "Required"),
    year: z.number().min(1900).max(2100),
    grade: z.string().optional(),
  })),
  bankDetails: z.object({
    accountNumber: z.string().min(1, "Required"),
    bankName: z.string().min(1, "Required"),
    branchName: z.string().min(1, "Required"),
    ifscCode: z.string().min(1, "Required"),
  }),
  salary: z.object({
    basicSalary: z.number().min(0),
    allowances: z.array(z.object({
      type: z.string().min(1),
      amount: z.number().min(0),
    })),
    deductions: z.array(z.object({
      type: z.string().min(1),
      amount: z.number().min(0),
    })),
  }),
  documents: z.array(z.object({
      type: z.enum(['resume', 'id_proof', 'address_proof', 'qualification', 'other']),
      name: z.string(),
      url: z.string(), // In real app, this would be handled by file upload logic
  })).optional()
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffFormProps {
  defaultValues?: Partial<StaffFormValues>;
  onSubmit: (data: StaffFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const STEPS = [
  { id: 1, title: "Personal Info" },
  { id: 2, title: "Contact Info" },
  { id: 3, title: "Employment" },
  { id: 4, title: "Qualifications" },
  { id: 5, title: "Bank & Salary" },
  { id: 6, title: "Documents" },
];

export default function StaffForm({ defaultValues, onSubmit, onCancel, isLoading }: StaffFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const {
    register,
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: defaultValues || {
        personalInfo: { gender: 'male', maritalStatus: 'single' },
        employmentInfo: { employmentType: 'full-time', department: 'teaching' },
        qualifications: [],
        salary: { basicSalary: 0, allowances: [], deductions: [] },
        documents: []
    },
  });

  const { fields: qualFields, append: appendQual, remove: removeQual } = useFieldArray({ control, name: "qualifications" });
  const { fields: allowFields, append: appendAllow, remove: removeAllow } = useFieldArray({ control, name: "salary.allowances" });
  const { fields: deducFields, append: appendDeduc, remove: removeDeduc } = useFieldArray({ control, name: "salary.deductions" });

  const nextStep = async () => {
    let isValid = false;
    // Validate only current step fields
    if (currentStep === 1) isValid = await trigger("personalInfo");
    if (currentStep === 2) isValid = await trigger("contactInfo");
    if (currentStep === 3) isValid = await trigger("employmentInfo");
    if (currentStep === 4) isValid = await trigger("qualifications");
    if (currentStep === 5) isValid = await trigger(["bankDetails", "salary"]);
    if (currentStep === 6) isValid = true; 

    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Stepper Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
        {STEPS.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setCurrentStep(step.id)}
            className={`flex flex-col items-center gap-1 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded p-1 ${
              step.id === currentStep
                ? "text-primary font-bold"
                : step.id < currentStep
                ? "text-green-600"
                : "text-muted-foreground"
            }`}
            aria-current={step.id === currentStep ? 'step' : undefined}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs transition-colors ${
                step.id === currentStep
                  ? "border-primary bg-primary text-primary-foreground"
                  : step.id < currentStep
                  ? "border-green-600 bg-green-100 text-green-700"
                  : "border-gray-300"
              }`}
            >
              {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <span className="text-[10px] uppercase tracking-wider hidden md:block">
              {step.title}
            </span>
          </button>
        ))}
      </div>

      {/* Form Content */}
      <ScrollArea className="flex-1 p-6">
        <form id="staff-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* STEP 1: Personal Info */}
          {currentStep === 1 && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name <span className="text-red-500">*</span></Label>
                  <Input {...register("personalInfo.firstName")} className={errors.personalInfo?.firstName && "border-red-500"} />
                  {errors.personalInfo?.firstName && <span className="text-xs text-red-500">{errors.personalInfo.firstName.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label>Last Name <span className="text-red-500">*</span></Label>
                  <Input {...register("personalInfo.lastName")} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date of Birth <span className="text-red-500">*</span></Label>
                  <Input type="date" {...register("personalInfo.dateOfBirth")} />
                </div>
                <div className="space-y-2">
                  <Label>Gender <span className="text-red-500">*</span></Label>
                  <Controller
                    control={control}
                    name="personalInfo.gender"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <Label>National ID <span className="text-red-500">*</span></Label>
                  <Input {...register("personalInfo.nationalId")} />
                </div>
                <div className="space-y-2">
                   <Label>Marital Status</Label>
                   <Controller
                    control={control}
                    name="personalInfo.maritalStatus"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Contact Info */}
          {currentStep === 2 && (
             <div className="grid gap-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Email Address <span className="text-red-500">*</span></Label>
                        <Input type="email" {...register("contactInfo.email")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone Number <span className="text-red-500">*</span></Label>
                        <Input {...register("contactInfo.phone")} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <Label>Alternate Phone</Label>
                    <Input {...register("contactInfo.alternatePhone")} />
                 </div>

                 <Separator />
                 <h4 className="font-semibold text-sm">Address</h4>
                 <div className="space-y-2">
                    <Label>Street Address <span className="text-red-500">*</span></Label>
                    <Input {...register("contactInfo.address.street")} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>City <span className="text-red-500">*</span></Label>
                        <Input {...register("contactInfo.address.city")} />
                    </div>
                    <div className="space-y-2">
                        <Label>State <span className="text-red-500">*</span></Label>
                        <Input {...register("contactInfo.address.state")} />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Postal Code <span className="text-red-500">*</span></Label>
                        <Input {...register("contactInfo.address.postalCode")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Country <span className="text-red-500">*</span></Label>
                        <Input {...register("contactInfo.address.country")} />
                    </div>
                 </div>

                 <Separator />
                 <h4 className="font-semibold text-sm">Emergency Contact</h4>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label>Name <span className="text-red-500">*</span></Label>
                        <Input {...register("contactInfo.emergencyContact.name")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Relationship <span className="text-red-500">*</span></Label>
                        <Input {...register("contactInfo.emergencyContact.relationship")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Phone <span className="text-red-500">*</span></Label>
                        <Input {...register("contactInfo.emergencyContact.phone")} />
                    </div>
                 </div>
             </div>
          )}

          {/* STEP 3: Employment */}
          {currentStep === 3 && (
            <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Department <span className="text-red-500">*</span></Label>
                         <Controller
                            control={control}
                            name="employmentInfo.department"
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select Department" /></SelectTrigger>
                                <SelectContent>
                                <SelectItem value="teaching">Teaching</SelectItem>
                                <SelectItem value="administration">Administration</SelectItem>
                                <SelectItem value="support">Support</SelectItem>
                                <SelectItem value="management">Management</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Designation <span className="text-red-500">*</span></Label>
                        <Input {...register("employmentInfo.designation")} placeholder="e.g. Senior Teacher" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label>Employment Type <span className="text-red-500">*</span></Label>
                         <Controller
                            control={control}
                            name="employmentInfo.employmentType"
                            render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                                <SelectContent>
                                <SelectItem value="full-time">Full Time</SelectItem>
                                <SelectItem value="part-time">Part Time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="temporary">Temporary</SelectItem>
                                </SelectContent>
                            </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Joining Date <span className="text-red-500">*</span></Label>
                        <Input type="date" {...register("employmentInfo.joiningDate")} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label>Work Location</Label>
                        <Input {...register("employmentInfo.workLocation")} />
                    </div>
                    <div className="space-y-2">
                        <Label>Shift</Label>
                        <Input {...register("employmentInfo.shift")} />
                    </div>
                </div>
            </div>
          )}

          {/* STEP 4: Qualifications */}
          {currentStep === 4 && (
              <div className="space-y-6">
                  {qualFields.map((field, index) => (
                      <Card key={field.id} className="relative">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                            onClick={() => removeQual(index)}
                          >
                              <X className="h-4 w-4" />
                          </Button>
                          <CardContent className="p-4 grid gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label>Degree/Certificate <span className="text-red-500">*</span></Label>
                                      <Input {...register(`qualifications.${index}.degree`)} />
                                  </div>
                                  <div className="space-y-2">
                                      <Label>Institution <span className="text-red-500">*</span></Label>
                                      <Input {...register(`qualifications.${index}.institution`)} />
                                  </div>
                              </div>
                               <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                      <Label>Year of Completion <span className="text-red-500">*</span></Label>
                                      <Input type="number" {...register(`qualifications.${index}.year`, { valueAsNumber: true })} />
                                  </div>
                                  <div className="space-y-2">
                                      <Label>Grade/Percentage</Label>
                                      <Input {...register(`qualifications.${index}.grade`)} />
                                  </div>
                              </div>
                          </CardContent>
                      </Card>
                  ))}
                  <Button type="button" variant="outline" onClick={() => appendQual({ degree: "", institution: "", year: new Date().getFullYear(), grade: "" })}>
                    <Upload className="h-4 w-4 mr-2" /> Add Qualification
                  </Button>
              </div>
          )}

          {/* STEP 5: Bank & Salary */}
          {currentStep === 5 && (
            <div className="grid gap-6">
                <h4 className="font-semibold text-sm">Bank Details</h4>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Account Number <span className="text-red-500">*</span></Label>
                        <Input {...register("bankDetails.accountNumber")} />
                    </div>
                     <div className="space-y-2">
                        <Label>IFSC Code <span className="text-red-500">*</span></Label>
                        <Input {...register("bankDetails.ifscCode")} />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Bank Name <span className="text-red-500">*</span></Label>
                        <Input {...register("bankDetails.bankName")} />
                    </div>
                     <div className="space-y-2">
                        <Label>Branch Name <span className="text-red-500">*</span></Label>
                        <Input {...register("bankDetails.branchName")} />
                    </div>
                 </div>

                 <Separator />
                 <h4 className="font-semibold text-sm">Salary Structure</h4>
                  <div className="space-y-2">
                        <Label>Basic Salary <span className="text-red-500">*</span></Label>
                        <Input type="number" {...register("salary.basicSalary", { valueAsNumber: true })} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                          <Label className="text-green-600 font-semibold">Allowances</Label>
                          {allowFields.map((field, index) => (
                              <div key={field.id} className="flex gap-2">
                                  <Input placeholder="Type" {...register(`salary.allowances.${index}.type`)} />
                                  <Input type="number" placeholder="Amount" {...register(`salary.allowances.${index}.amount`, { valueAsNumber: true })} />
                                  <Button type="button" variant="ghost" size="icon" onClick={() => removeAllow(index)}><X className="h-4 w-4" /></Button>
                              </div>
                          ))}
                          <Button type="button" size="sm" variant="outline" onClick={() => appendAllow({ type: "", amount: 0 })}>+ Add Allowance</Button>
                      </div>

                      <div className="space-y-3">
                          <Label className="text-red-600 font-semibold">Deductions</Label>
                          {deducFields.map((field, index) => (
                              <div key={field.id} className="flex gap-2">
                                  <Input placeholder="Type" {...register(`salary.deductions.${index}.type`)} />
                                  <Input type="number" placeholder="Amount" {...register(`salary.deductions.${index}.amount`, { valueAsNumber: true })} />
                                  <Button type="button" variant="ghost" size="icon" onClick={() => removeDeduc(index)}><X className="h-4 w-4" /></Button>
                              </div>
                          ))}
                          <Button type="button" size="sm" variant="outline" onClick={() => appendDeduc({ type: "", amount: 0 })}>+ Add Deduction</Button>
                      </div>
                  </div>
            </div>
          )}

          {/* STEP 6: Documents */}
          {currentStep === 6 && (
            <div className="text-center py-10 space-y-4">
                <div className="border-2 border-dashed rounded-lg p-10 hover:bg-gray-50 transition cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm font-medium">Click or drag files here to upload documents</p>
                    <p className="text-xs text-muted-foreground mt-2">Resume, ID Proof, Certificates etc.</p>
                </div>
                <div className="flex justify-between items-center text-sm p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
                    <span>Note: Document upload integration will be connected to the backend storage service.</span>
                </div>
            </div>
          )}
        </form>
      </ScrollArea>

      {/* Footer Actions */}
      <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50/50">
        <Button
          type="button"
          variant="outline"
          onClick={currentStep === 1 ? onCancel : prevStep}
          className="flex items-center gap-2"
        >
          {currentStep === 1 ? (<>Cancel</>) : (<><ChevronsLeft className="h-4 w-4" /> Previous</>)}
        </Button>
        <div className="flex gap-2">
            {currentStep < STEPS.length ? (
                <Button type="button" onClick={nextStep} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center gap-2">
                    Next Step <ChevronsRight className="h-4 w-4" />
                </Button>
            ) : (
                <Button type="button" onClick={handleSubmit(onSubmit)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center gap-2" disabled={isLoading}>
                    {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>) : (<>Submit Staff Profile <Check className="h-4 w-4" /></>)}
                </Button>
            )}
        </div>
      </div>
    </div>
  );
}

"use client"

import { useState } from "react"
import Link from "next/link"
import apiClient from "@/lib/api/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  GraduationCap,
  ArrowLeft,
  Send,
  Loader2,
  Mail,
  Phone,
  Building2,
  User,
  MessageSquare,
  CheckCircle2,
  MapPin,
  Clock
} from "lucide-react"
import { toast } from "sonner"

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  organization: z.string().min(2, { message: "Organization name is required." }),
  role: z.string().min(1, { message: "Please select your role." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(20, { message: "Message must be at least 20 characters." }),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      organization: "",
      role: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      // Send data to backend endpoint
      await apiClient.post('/contact', values);

      console.log("Contact form submitted:", values)
      setIsSubmitted(true)
      toast.success("Your request has been submitted successfully!")
    } catch (error: any) {
      console.error("Submission error:", error);
      const msg = error.response?.data?.message || "Failed to submit. Plese try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Request Submitted!</h1>
            <p className="text-slate-600 mb-6">
              Thank you for your interest in Progress LMS. Our team will review your request and get back to you within 24-48 hours.
            </p>
            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white">
                  Back to Login
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsSubmitted(false)
                  form.reset()
                }}
              >
                Submit Another Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/login" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Login</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Progress LMS</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Request Access
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Progress LMS is an invite-only platform. Fill out the form below to request access for your school or organization.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Email Support</h3>
                  <p className="text-indigo-600 font-medium">support@progresslms.com</p>
                  <p className="text-sm text-slate-500 mt-1">We respond within 24 hours</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Phone Support</h3>
                  <p className="text-green-600 font-medium">+1 (555) 123-4567</p>
                  <p className="text-sm text-slate-500 mt-1">Mon-Fri, 9AM - 6PM EST</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Office Location</h3>
                  <p className="text-slate-700">123 Education Street</p>
                  <p className="text-sm text-slate-500">New York, NY 10001</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Response Time</h3>
                  <p className="text-slate-700">24-48 business hours</p>
                  <p className="text-sm text-slate-500">For access requests</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
              <h4 className="font-semibold text-indigo-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-indigo-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600">1.</span>
                  Our team reviews your request
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600">2.</span>
                  We verify your organization details
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600">3.</span>
                  You receive login credentials via email
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-indigo-600">4.</span>
                  Start managing your school with Progress LMS
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200/60 p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Access Request Form</h2>
                <p className="text-slate-500 text-sm">Please provide accurate information for faster processing.</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* Row 1 - Name & Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Full Name *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="John Doe"
                                className="pl-10 h-11 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-100"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Email Address *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                type="email"
                                placeholder="john@school.edu"
                                className="pl-10 h-11 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-100"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 2 - Phone & Organization */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Phone Number *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="+1 (555) 000-0000"
                                className="pl-10 h-11 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-100"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">School / Organization *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="XYZ High School"
                                className="pl-10 h-11 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-100"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-xs" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 3 - Role */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Your Role *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-100">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="school_administrator">School Administrator / Principal</SelectItem>
                            <SelectItem value="it_administrator">IT Administrator</SelectItem>
                            <SelectItem value="teacher">Teacher / Faculty</SelectItem>
                            <SelectItem value="parent">Parent / Guardian</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs text-slate-500">
                          This helps us understand your access requirements
                        </FormDescription>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Row 4 - Subject */}
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Subject *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Request for school account setup"
                            className="h-11 border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-100"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Row 5 - Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Message *</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe your requirements, the number of students/teachers, and any specific features you need..."
                            className="min-h-[120px] border-slate-200 bg-slate-50 focus:border-indigo-500 focus:ring-indigo-100 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-slate-500">
                          Include details about your school size and specific requirements
                        </FormDescription>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Submit Request
                      </>
                    )}
                  </Button>

                  {/* Privacy Note */}
                  <p className="text-xs text-slate-500 text-center">
                    By submitting this form, you agree to our{" "}
                    <Link href="/privacy" className="text-indigo-600 hover:underline">Privacy Policy</Link>
                    . We'll never share your information with third parties.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2024 Progress LMS. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-slate-500 hover:text-slate-700 text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-slate-500 hover:text-slate-700 text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

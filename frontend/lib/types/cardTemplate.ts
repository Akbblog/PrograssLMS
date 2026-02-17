export interface CardTemplateField {
  fieldId: string;
  label: string;
  show: boolean;
  section: 'left' | 'right' | 'center' | 'header' | 'footer';
  order: number;
  fontSize: number;
  fontFamily: string;
  fontColor: string;
  bold: boolean;
  alignment: 'left' | 'center' | 'right';
  maxWidth: number;
}

export interface CardTemplateLayout {
  orientation: 'portrait' | 'landscape';
  width: number;
  height: number;
  showQRCode: boolean;
  qrPosition: 'top-right' | 'bottom-right' | 'bottom-left' | 'center';
  showPhoto: boolean;
  photoPosition: 'top-left' | 'top-right' | 'top-center';
  showSignature: boolean;
  showSchoolLogo: boolean;
}

export interface CardTemplateStyling {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  backgroundImage: string;
  backgroundOpacity: number;
  borderRadius: number;
  borderColor: string;
  borderWidth: number;
  headerStyle: 'gradient' | 'solid' | 'none';
}

export interface CardTemplate {
  _id: string;
  schoolId: string;
  name: string;
  entityType: 'student' | 'teacher';
  version: number;
  isActive: boolean;
  layout: CardTemplateLayout;
  styling: CardTemplateStyling;
  fields: CardTemplateField[];
  customText: {
    header: string;
    footer: string;
    watermark: string;
  };
  preview?: {
    dataUrl: string;
    generatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Sample data for live preview
export const SAMPLE_STUDENT_DATA = {
  name: 'Ahmed Khan',
  studentId: 'STU2024001',
  class: 'Grade 10-A',
  fatherName: 'Muhammad Khan',
  dateOfBirth: '2008-03-15',
  bloodGroup: 'A+',
  phone: '+92 300 1234567',
  address: '123 Main Street, Islamabad',
  emergencyContact: 'Mrs. Khan - 0300 7654321',
  avatar: null,
};

export const SAMPLE_TEACHER_DATA = {
  name: 'Dr. Sarah Ahmed',
  teacherId: 'TCH2024001',
  role: 'Senior Teacher',
  subject: 'Mathematics',
  email: 'sarah.ahmed@school.edu',
  phone: '+92 301 9876543',
  dateEmployed: '2020-01-15',
  bloodGroup: 'B+',
  address: '456 University Road, Lahore',
  avatar: null,
};

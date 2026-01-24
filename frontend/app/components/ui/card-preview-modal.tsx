'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Eye } from 'lucide-react';
import { getSchoolBranding } from '@/app/lib/school-branding';

interface CardPreviewModalProps {
  trigger: React.ReactNode;
  cardData: {
    type: 'student' | 'teacher';
    data: any;
    qrDataUrl?: string;
    attendanceData?: {
      percentage: number;
      presentDays: number;
      totalDays: number;
    };
    academicData?: {
      gpa: string;
      class: string;
      session: string;
    };
    employmentInfo?: {
      designation: string;
      department: string;
      subject: string;
      joiningDate: string;
      experience: string;
      employmentType: string;
    };
  };
  onDownload?: () => void;
}

export function CardPreviewModal({ trigger, cardData, onDownload }: CardPreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [branding, setBranding] = useState<any>(null);

  const getCardPreview = () => {
    if (!branding) return null;

    const { type, data, qrDataUrl } = cardData;
    
    if (type === 'student') {
      return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold" style={{ color: branding.colors.primary }}>
              {branding.name}
            </h2>
            <p className="text-sm text-gray-600">{branding.motto}</p>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              {data.avatar ? (
                <img src={data.avatar} alt="Student" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-2xl">👤</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{data.firstName} {data.lastName}</h3>
              <p className="text-sm text-gray-600">Student ID: {data.studentId || data.id}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="font-medium">Class</p>
              <p>{data.class?.name || data.className || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Section</p>
              <p>{data.section || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Gender</p>
              <p>{data.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Date of Birth</p>
              <p>{data.dateOfBirth ? new Date(data.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          
          {cardData.attendanceData && (
            <div className="mb-4 p-3 rounded" style={{ 
              backgroundColor: cardData.attendanceData.percentage >= 90 ? '#DCFCE7' : 
                              cardData.attendanceData.percentage >= 75 ? '#FEF3C7' : '#FEE2E2' 
            }}>
              <p className="font-medium">Attendance</p>
              <p>{cardData.attendanceData.percentage}% ({cardData.attendanceData.presentDays}/{cardData.attendanceData.totalDays} days)</p>
            </div>
          )}
          
          {cardData.academicData && (
            <div className="mb-4 p-3 rounded" style={{ 
              backgroundColor: parseFloat(cardData.academicData.gpa) >= 3.5 ? '#DCFCE7' : 
                              parseFloat(cardData.academicData.gpa) >= 2.5 ? '#FEF3C7' : '#FEE2E2' 
            }}>
              <p className="font-medium">Academic Performance</p>
              <p>GPA: {cardData.academicData.gpa}</p>
              <p>Class: {cardData.academicData.class}</p>
              <p>Session: {cardData.academicData.session}</p>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="text-xs text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
            {qrDataUrl && (
              <div className="w-12 h-12">
                <img src={qrDataUrl} alt="QR Code" className="w-full h-full" />
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold" style={{ color: branding.colors.primary }}>
              {branding.name}
            </h2>
            <p className="text-sm text-gray-600">{branding.motto}</p>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              {data.avatar ? (
                <img src={data.avatar} alt="Teacher" className="w-full h-full rounded-full object-cover" />
              ) : (
                <span className="text-2xl">👨‍🏫</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{data.firstName} {data.lastName}</h3>
              <p className="text-sm text-gray-600">Teacher ID: {data.teacherId || data.id}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="font-medium">Designation</p>
              <p>{cardData.employmentInfo?.designation || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Department</p>
              <p>{cardData.employmentInfo?.department || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Subject</p>
              <p>{cardData.employmentInfo?.subject || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Joining Date</p>
              <p>{cardData.employmentInfo?.joiningDate || 'N/A'}</p>
            </div>
          </div>
          
          {cardData.employmentInfo && (
            <div className="mb-4 p-3 rounded bg-gray-50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Experience</p>
                  <p>{cardData.employmentInfo.experience}</p>
                </div>
                <div>
                  <p className="font-medium">Employment Type</p>
                  <p>{cardData.employmentInfo.employmentType}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="text-xs text-gray-500">
              {new Date().toLocaleDateString()}
            </div>
            {qrDataUrl && (
              <div className="w-12 h-12">
                <img src={qrDataUrl} alt="QR Code" className="w-full h-full" />
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Card Preview</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onDownload) onDownload();
                  setIsOpen(false);
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex justify-center p-4">
          {getCardPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
// Default school branding
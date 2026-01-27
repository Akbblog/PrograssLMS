'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { IDCard } from '@/components/ui/id-card';

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

  const handlePrint = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the ID card');
      return;
    }

    // Get the card element
    const cardElement = document.querySelector('.id-card-wrapper');
    if (!cardElement) return;

    // Write the print document
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${cardData.type === 'student' ? 'Student' : 'Teacher'} ID Card</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              background: #f8fafc;
              font-family: 'Inter', 'Segoe UI', sans-serif;
            }
            @media print {
              body {
                background: white;
              }
              @page {
                size: landscape;
                margin: 0.5in;
              }
            }
          </style>
        </head>
        <body>
          ${cardElement.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100">
          <DialogTitle className="flex items-center justify-between">
            <span className="text-lg font-bold text-slate-800">
              {cardData.type === 'student' ? 'Student' : 'Teacher'} ID Card Preview
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-slate-600 hover:text-slate-800"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (onDownload) onDownload();
                  setIsOpen(false);
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center">
          <div className="transform scale-90 origin-top">
            <IDCard
              type={cardData.type}
              data={cardData.data}
              showQRCode={true}
              showSignature={true}
            />
          </div>
        </div>

        {/* Card Info Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              {cardData.type === 'student' ? 'Student ID: ' : 'Employee ID: '}
              <strong className="text-slate-700">
                {cardData.data?.studentId || cardData.data?.teacherId || cardData.data?.employeeId || 'N/A'}
              </strong>
            </span>
            <span>
              Card generated on: <strong className="text-slate-700">{new Date().toLocaleDateString()}</strong>
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

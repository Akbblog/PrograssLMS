'use client';

import React, { useEffect, useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { getSchoolBranding, SchoolBranding, defaultSchoolBranding } from '@/app/lib/school-branding';
import { cn } from '@/lib/utils';

// ========================
// TYPES & INTERFACES
// ========================

interface StudentCardData {
  name: string;
  studentId: string;
  class?: string;
  section?: string;
  fatherName?: string;
  fatherPhone?: string;
  address?: string;
  house?: string;
  avatar?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  cardExpiry?: string;
  guardian?: {
    name?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
  };
  currentClassLevel?: {
    name?: string;
  } | string;
}

interface TeacherCardData {
  name: string;
  teacherId?: string;
  employeeId?: string;
  designation?: string;
  department?: string;
  subject?: string | { name?: string };
  phone?: string;
  nicNumber?: string;
  bloodGroup?: string;
  joiningDate?: string;
  dateEmployed?: string;
  avatar?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
}

interface IDCardProps {
  type: 'student' | 'teacher';
  data: StudentCardData | TeacherCardData;
  className?: string;
  showQRCode?: boolean;
  showSignature?: boolean;
}

// ========================
// STUDENT ID CARD
// ========================

function StudentIDCard({
  data,
  branding,
  showQRCode = true,
  showSignature = true,
}: {
  data: StudentCardData;
  branding: SchoolBranding;
  showQRCode?: boolean;
  showSignature?: boolean;
}) {
  const studentData = data as StudentCardData;

  // Get class name
  const getClassName = (): string => {
    if (typeof studentData.currentClassLevel === 'object' && studentData.currentClassLevel?.name) {
      return studentData.currentClassLevel.name;
    }
    if (typeof studentData.currentClassLevel === 'string') {
      return studentData.currentClassLevel;
    }
    return studentData.class || 'N/A';
  };

  // Get father's name
  const getFatherName = () => {
    return studentData.fatherName || studentData.guardian?.name || 'N/A';
  };

  // Get father's phone
  const getFatherPhone = () => {
    return studentData.fatherPhone || studentData.guardian?.phone || 'N/A';
  };

  // Get address
  const getAddress = () => {
    if (studentData.address) return studentData.address;
    if (studentData.guardian?.address) {
      const addr = studentData.guardian.address;
      return [addr.street, addr.city, addr.state, addr.country].filter(Boolean).join(', ');
    }
    return 'N/A';
  };

  // Calculate expiry date (1 year from now if not provided)
  const getExpiryDate = () => {
    if (studentData.cardExpiry) {
      return new Date(studentData.cardExpiry).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    return expiry.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="id-card student-card" style={{
      width: '500px',
      height: '310px',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      borderRadius: '16px',
      overflow: 'hidden',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: 'relative',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    }}>
      {/* Header with Logo and School Name */}
      <div style={{
        background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0ea5e9 100%)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '3px solid #38bdf8',
      }}>
        {/* School Logo */}
        <div style={{
          width: '50px',
          height: '50px',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 25%, #eab308 50%, #f97316 75%, #ef4444 100%)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          padding: '6px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: ['#22c55e', '#facc15', '#f97316', '#3b82f6'][i],
              border: '2px solid white',
            }} />
          ))}
        </div>

        {/* School Name */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '800',
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '0.5px',
          }}>
            {branding.name.toUpperCase()}
          </h1>
        </div>

        {/* Superscript */}
        <div style={{
          background: '#facc15',
          color: '#713f12',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '10px',
          fontWeight: '700',
          boxShadow: '0 2px 8px rgba(250,204,21,0.4)',
        }}>
          PSI
        </div>
      </div>

      {/* Card Type Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #0369a1 0%, #0284c7 100%)',
        padding: '6px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{
          color: '#fef08a',
          fontSize: '14px',
          fontWeight: '700',
          letterSpacing: '2px',
        }}>
          STUDENT ID CARD
        </span>
        <span style={{
          color: 'white',
          fontSize: '12px',
          fontWeight: '600',
        }}>
          Ph: {branding.phone}
        </span>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        padding: '15px 20px',
        gap: '15px',
      }}>
        {/* Photo Section */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '100px',
            height: '120px',
            background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '3px solid #0284c7',
            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {studentData.avatar ? (
              <img
                src={studentData.avatar}
                alt={studentData.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#0284c7',
              }}>
                {studentData.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* QR Code below photo */}
          {showQRCode && (
            <div style={{
              marginTop: '8px',
              background: 'white',
              padding: '4px',
              borderRadius: '4px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <QRCodeSVG
                value={`STUDENT:${studentData.studentId}`}
                size={50}
                level="M"
              />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div style={{ flex: 1 }}>
          {/* Student ID and Name */}
          <div style={{
            background: 'linear-gradient(90deg, #f0f9ff 0%, #e0f2fe 100%)',
            padding: '8px 12px',
            borderRadius: '6px',
            marginBottom: '10px',
            borderLeft: '4px solid #0284c7',
          }}>
            <span style={{
              color: '#0369a1',
              fontSize: '16px',
              fontWeight: '700',
            }}>
              ({studentData.studentId}) - {studentData.name}
            </span>
          </div>

          {/* Details Grid */}
          <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
            <div style={{ display: 'flex', marginBottom: '3px' }}>
              <span style={{ color: '#475569', width: '85px' }}>Student's Class :</span>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>{getClassName()}{(studentData.section ? `(${String(studentData.section)})` : '')}</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '3px' }}>
              <span style={{ color: '#475569', width: '85px' }}>Father's Name :</span>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>{getFatherName()}</span>
            </div>
            <div style={{ display: 'flex', marginBottom: '3px' }}>
              <span style={{ color: '#475569', width: '85px' }}>Father's Phone :</span>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>{getFatherPhone()}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#475569', width: '85px', flexShrink: 0 }}></span>
              <span style={{ fontWeight: '600', color: '#0f172a', fontSize: '10px' }}>{getAddress()}</span>
            </div>
          </div>
        </div>

        {/* Right Side - House & Expiry */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          minWidth: '100px',
        }}>
          {/* House Badge */}
          {studentData.house && (
            <div style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
            }}>
              {studentData.house}
            </div>
          )}

          {/* Expiry & Signature */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Card Expiry</div>
              <div style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#dc2626',
              }}>
                {getExpiryDate()}
              </div>
            </div>

            {showSignature && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize: '20px',
                  color: '#0369a1',
                  fontStyle: 'italic',
                  marginBottom: '2px',
                }}>
                  Signature
                </div>
                <div style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: '#dc2626',
                  textTransform: 'uppercase',
                }}>
                  PRINCIPAL
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
        padding: '8px 20px',
        textAlign: 'center',
        color: 'white',
        fontSize: '11px',
        fontWeight: '500',
      }}>
        {branding.address}
      </div>
    </div>
  );
}

// ========================
// TEACHER ID CARD
// ========================

function TeacherIDCard({
  data,
  branding,
  showQRCode = true,
  showSignature = true,
}: {
  data: TeacherCardData;
  branding: SchoolBranding;
  showQRCode?: boolean;
  showSignature?: boolean;
}) {
  const teacherData = data as TeacherCardData;

  // Get subject name
  const getSubjectName = () => {
    if (typeof teacherData.subject === 'object' && teacherData.subject?.name) {
      return teacherData.subject.name;
    }
    return teacherData.subject || teacherData.designation || 'Teacher';
  };

  // Get joining date
  const getJoiningDate = () => {
    const date = teacherData.joiningDate || teacherData.dateEmployed;
    if (date) {
      return new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    return 'N/A';
  };

  // Get address
  const getAddress = () => {
    if (teacherData.address) {
      const addr = teacherData.address;
      return [addr.street, addr.city, addr.state, addr.country].filter(Boolean).join(', ');
    }
    return 'N/A';
  };

  return (
    <div className="id-card teacher-card" style={{
      width: '500px',
      height: '310px',
      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
      borderRadius: '16px',
      overflow: 'hidden',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      position: 'relative',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.5)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0ea5e9 100%)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '3px solid #38bdf8',
      }}>
        {/* School Logo */}
        <div style={{
          width: '50px',
          height: '50px',
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 25%, #eab308 50%, #f97316 75%, #ef4444 100%)',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          padding: '6px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: ['#22c55e', '#facc15', '#f97316', '#3b82f6'][i],
              border: '2px solid white',
            }} />
          ))}
        </div>

        {/* School Name */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '800',
            margin: 0,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            letterSpacing: '0.5px',
          }}>
            {branding.name.toUpperCase()}
          </h1>
        </div>

        {/* Badge */}
        <div style={{
          background: '#facc15',
          color: '#713f12',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '10px',
          fontWeight: '700',
          boxShadow: '0 2px 8px rgba(250,204,21,0.4)',
        }}>
          PSI
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'flex',
        padding: '20px',
        gap: '20px',
        position: 'relative',
      }}>
        {/* Left Side Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '11px' }}>
          <div>
            <div style={{ color: '#64748b', marginBottom: '2px' }}>Staff Phone:</div>
            <div style={{ fontWeight: '700', color: '#0369a1' }}>{teacherData.phone || 'N/A'}</div>
          </div>
          <div>
            <div style={{ color: '#64748b', marginBottom: '2px' }}>Blood Group:</div>
            <div style={{ fontWeight: '700', color: '#dc2626' }}>{teacherData.bloodGroup || 'N/A'}</div>
          </div>
          <div>
            <div style={{ color: '#64748b', marginBottom: '2px' }}>Address:</div>
            <div style={{
              fontWeight: '600',
              color: '#dc2626',
              maxWidth: '120px',
              fontSize: '10px',
              lineHeight: '1.4',
            }}>
              {getAddress()}
            </div>
          </div>
        </div>

        {/* Center - Photo and Name */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Photo */}
          <div style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
            padding: '4px',
            boxShadow: '0 8px 25px rgba(3, 105, 161, 0.4)',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#e0f2fe',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {teacherData.avatar ? (
                <img
                  src={teacherData.avatar}
                  alt={teacherData.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#0284c7',
                }}>
                  {teacherData.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* Name and Designation */}
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#0f172a',
            }}>
              {teacherData.name}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#475569',
              marginTop: '2px',
            }}>
              {getSubjectName()}
            </div>
          </div>

          {/* QR Code */}
          {showQRCode && (
            <div style={{
              marginTop: '10px',
              background: 'white',
              padding: '6px',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}>
              <QRCodeSVG
                value={`TEACHER:${teacherData.teacherId || teacherData.employeeId}`}
                size={60}
                level="M"
              />
            </div>
          )}
        </div>

        {/* Right Side Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '11px', textAlign: 'right' }}>
          <div>
            <div style={{ color: '#64748b', marginBottom: '2px' }}>NIC Number:</div>
            <div style={{ fontWeight: '700', color: '#0369a1' }}>{teacherData.nicNumber || teacherData.employeeId || 'N/A'}</div>
          </div>
          <div>
            <div style={{ color: '#64748b', marginBottom: '2px' }}>Joining Date:</div>
            <div style={{ fontWeight: '700', color: '#dc2626' }}>{getJoiningDate()}</div>
          </div>

          {/* Signature */}
          {showSignature && (
            <div style={{ marginTop: 'auto' }}>
              <div style={{
                fontFamily: "'Dancing Script', cursive",
                fontSize: '22px',
                color: '#0369a1',
                fontStyle: 'italic',
              }}>
                Signature
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
        padding: '8px 20px',
        textAlign: 'center',
        color: 'white',
        fontSize: '11px',
        fontWeight: '500',
      }}>
        {branding.address} - Ph: {branding.phone}
      </div>
    </div>
  );
}

// ========================
// MAIN ID CARD COMPONENT
// ========================

export function IDCard({
  type,
  data,
  className,
  showQRCode = true,
  showSignature = true,
}: IDCardProps) {
  const [branding, setBranding] = useState<SchoolBranding>(defaultSchoolBranding);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const brandingData = await getSchoolBranding();
        setBranding(brandingData);
      } catch (error) {
        console.error('Failed to load branding:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadBranding();
  }, []);

  if (isLoading) {
    return (
      <div className={cn("animate-pulse bg-slate-200 rounded-xl", className)} style={{ width: '500px', height: '310px' }} />
    );
  }

  return (
    <div className={cn("id-card-wrapper", className)}>
      {type === 'student' ? (
        <StudentIDCard
          data={data as StudentCardData}
          branding={branding}
          showQRCode={showQRCode}
          showSignature={showSignature}
        />
      ) : (
        <TeacherIDCard
          data={data as TeacherCardData}
          branding={branding}
          showQRCode={showQRCode}
          showSignature={showSignature}
        />
      )}
    </div>
  );
}

// ========================
// PRINTABLE ID CARD (for PDF/Download)
// ========================

export function PrintableIDCard({
  type,
  data,
  showQRCode = true,
  showSignature = true,
}: Omit<IDCardProps, 'className'>) {
  const [branding, setBranding] = useState<SchoolBranding>(defaultSchoolBranding);

  useEffect(() => {
    const loadBranding = async () => {
      try {
        const brandingData = await getSchoolBranding();
        setBranding(brandingData);
      } catch (error) {
        console.error('Failed to load branding:', error);
      }
    };
    loadBranding();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      background: '#f8fafc',
    }}>
      {type === 'student' ? (
        <StudentIDCard
          data={data as StudentCardData}
          branding={branding}
          showQRCode={showQRCode}
          showSignature={showSignature}
        />
      ) : (
        <TeacherIDCard
          data={data as TeacherCardData}
          branding={branding}
          showQRCode={showQRCode}
          showSignature={showSignature}
        />
      )}
    </div>
  );
}

export default IDCard;

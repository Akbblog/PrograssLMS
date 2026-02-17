const React = require('react');
const { Document, Page, View, Text, Image, StyleSheet } = require('@react-pdf/renderer');

// Default fields for student cards
const DEFAULT_STUDENT_FIELDS = [
  { fieldId: 'name', label: 'Name', show: true, section: 'left', order: 0, fontSize: 14, bold: true, fontColor: '#000000', alignment: 'left' },
  { fieldId: 'studentId', label: 'ID', show: true, section: 'left', order: 1, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'class', label: 'Class', show: true, section: 'left', order: 2, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'fatherName', label: "Father's Name", show: true, section: 'left', order: 3, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'dateOfBirth', label: 'DOB', show: true, section: 'left', order: 4, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'bloodGroup', label: 'Blood Group', show: false, section: 'left', order: 5, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'phone', label: 'Phone', show: false, section: 'left', order: 6, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'address', label: 'Address', show: false, section: 'left', order: 7, fontSize: 9, bold: false, fontColor: '#555555', alignment: 'left' },
  { fieldId: 'emergencyContact', label: 'Emergency', show: false, section: 'left', order: 8, fontSize: 9, bold: false, fontColor: '#555555', alignment: 'left' },
];

/**
 * Extract a field value from the student object.
 */
function getFieldValue(student, fieldId) {
  switch (fieldId) {
    case 'name': return student.name || 'Student Name';
    case 'studentId': return student.studentId || student.id || student._id || 'N/A';
    case 'class': {
      if (student.className) return student.className;
      if (student.currentClassLevel && typeof student.currentClassLevel === 'object') return student.currentClassLevel.name || 'N/A';
      if (student.currentClassLevels && student.currentClassLevels[0]) {
        const cl = student.currentClassLevels[0];
        return typeof cl === 'object' ? cl.name : cl;
      }
      return student.currentClassLevel || student.class || 'N/A';
    }
    case 'fatherName': return student.guardian?.name || student.fatherName || '';
    case 'dateOfBirth': return student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A';
    case 'bloodGroup': return student.bloodGroup || '';
    case 'phone': return student.phone || student.guardian?.phone || '';
    case 'address': {
      const addr = student.guardian?.address || student.address || {};
      if (typeof addr === 'string') return addr;
      return [addr.street, addr.city, addr.state].filter(Boolean).join(', ') || '';
    }
    case 'emergencyContact': {
      const ec = student.emergencyContact || {};
      return ec.name ? `${ec.name} - ${ec.phone || ''}` : '';
    }
    default: return student[fieldId] || '';
  }
}

module.exports = function StudentCardTemplate({
  student = {},
  qrDataUrl = null,
  school = {},
  template = null,
  attendanceData = null,
  academicData = null,
}) {
  // Use template styling or defaults
  const styling = template?.styling || {};
  const layout = template?.layout || {};
  const fields = (template?.fields || DEFAULT_STUDENT_FIELDS)
    .filter(f => f.show !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const primaryColor = styling.primaryColor || '#3B82F6';
  const secondaryColor = styling.secondaryColor || '#10B981';
  const bgColor = styling.backgroundColor || '#FFFFFF';
  const borderRadius = styling.borderRadius || 8;
  const borderColor = styling.borderColor || '#E5E7EB';
  const borderWidth = styling.borderWidth || 1;
  const headerStyle = styling.headerStyle || 'gradient';
  const showQR = layout.showQRCode !== false;
  const showPhoto = layout.showPhoto !== false;
  const showLogo = layout.showSchoolLogo !== false;

  // Determine avatar source
  const avatarSrc = student.avatar || student.photoUrl || null;

  const styles = StyleSheet.create({
    page: { padding: 0, fontSize: 10, fontFamily: 'Helvetica', backgroundColor: '#f0f0f0' },
    card: {
      width: 288,
      height: 432,
      backgroundColor: bgColor,
      borderWidth: borderWidth,
      borderColor: borderColor,
      borderRadius: borderRadius,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      backgroundColor: primaryColor,
      paddingVertical: 10,
      paddingHorizontal: 12,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    headerText: {
      flex: 1,
    },
    schoolName: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 2 },
    schoolSubtext: { fontSize: 8, color: '#ffffffcc' },
    logoContainer: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', backgroundColor: '#ffffff33' },
    logo: { width: 40, height: 40, objectFit: 'cover' },
    body: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      padding: 10,
      gap: 10,
    },
    leftCol: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' },
    rightCol: { width: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
    photoContainer: {
      width: 80,
      height: 95,
      borderWidth: 2,
      borderColor: primaryColor,
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    photo: { width: 80, height: 95, objectFit: 'cover' },
    photoFallback: { fontSize: 20, color: '#9ca3af', fontWeight: 'bold' },
    qr: { width: 80, height: 80 },
    fieldRow: { marginBottom: 3, display: 'flex', flexDirection: 'row', gap: 3 },
    fieldLabel: { fontSize: 8, color: '#6b7280', minWidth: 50 },
    fieldValue: { fontSize: 10, color: '#111827' },
    footer: {
      backgroundColor: primaryColor,
      paddingVertical: 5,
      paddingHorizontal: 12,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    footerText: { fontSize: 7, color: '#ffffffcc' },
    accentBar: { height: 3, backgroundColor: secondaryColor },
  });

  // Split fields into name (first rendered prominently) and the rest
  const nameField = fields.find(f => f.fieldId === 'name');
  const otherFields = fields.filter(f => f.fieldId !== 'name');

  return (
    React.createElement(Document, null,
      React.createElement(Page, { size: [288, 432], style: styles.page },
        React.createElement(View, { style: styles.card },
          // Header with school branding
          React.createElement(View, { style: styles.header },
            showLogo && school.logo
              ? React.createElement(View, { style: styles.logoContainer },
                  React.createElement(Image, { src: school.logo, style: styles.logo })
                )
              : null,
            React.createElement(View, { style: styles.headerText },
              React.createElement(Text, { style: styles.schoolName }, school.name || 'School Name'),
              React.createElement(Text, { style: styles.schoolSubtext },
                template?.customText?.header || school.address?.city || school.phone || ''
              )
            )
          ),
          // Accent bar
          React.createElement(View, { style: styles.accentBar }),
          // Body
          React.createElement(View, { style: styles.body },
            // Left column - fields
            React.createElement(View, { style: styles.leftCol },
              // Name prominently
              nameField
                ? React.createElement(Text, {
                    style: {
                      fontSize: nameField.fontSize || 14,
                      fontWeight: nameField.bold !== false ? 'bold' : 'normal',
                      color: nameField.fontColor || '#111827',
                      marginBottom: 6,
                      textAlign: nameField.alignment || 'left',
                    }
                  }, getFieldValue(student, 'name'))
                : React.createElement(Text, { style: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 } }, student.name || 'Student Name'),
              // Other fields
              ...otherFields.map((field, idx) => {
                const val = getFieldValue(student, field.fieldId);
                if (!val) return null;
                return React.createElement(View, { key: `f-${idx}`, style: styles.fieldRow },
                  React.createElement(Text, { style: styles.fieldLabel }, `${field.label}:`),
                  React.createElement(Text, {
                    style: {
                      fontSize: field.fontSize || 10,
                      fontWeight: field.bold ? 'bold' : 'normal',
                      color: field.fontColor || '#111827',
                      textAlign: field.alignment || 'left',
                    }
                  }, String(val))
                );
              }).filter(Boolean),
              // Attendance data if provided
              attendanceData
                ? React.createElement(View, { style: styles.fieldRow },
                    React.createElement(Text, { style: styles.fieldLabel }, 'Attendance:'),
                    React.createElement(Text, {
                      style: {
                        fontSize: 10,
                        color: attendanceData.percentage >= 90 ? '#059669' : attendanceData.percentage >= 75 ? '#d97706' : '#dc2626',
                      }
                    }, `${attendanceData.percentage || 0}%`)
                  )
                : null,
              // Academic data if provided
              academicData
                ? React.createElement(View, { style: styles.fieldRow },
                    React.createElement(Text, { style: styles.fieldLabel }, 'GPA:'),
                    React.createElement(Text, {
                      style: {
                        fontSize: 10,
                        color: academicData.gpa >= 3.5 ? '#059669' : academicData.gpa >= 3.0 ? '#d97706' : '#dc2626',
                      }
                    }, String(academicData.gpa || '0.00'))
                  )
                : null,
            ),
            // Right column - photo + QR
            React.createElement(View, { style: styles.rightCol },
              showPhoto
                ? React.createElement(View, { style: styles.photoContainer },
                    avatarSrc
                      ? React.createElement(Image, { src: avatarSrc, style: styles.photo })
                      : React.createElement(Text, { style: styles.photoFallback },
                          (student.name || 'NA').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                        )
                  )
                : null,
              showQR && qrDataUrl
                ? React.createElement(Image, { src: qrDataUrl, style: styles.qr })
                : showQR
                  ? React.createElement(View, { style: { width: 80, height: 80, backgroundColor: '#e5e7eb', borderRadius: 4 } })
                  : null,
            )
          ),
          // Footer
          React.createElement(View, { style: styles.footer },
            React.createElement(Text, { style: styles.footerText },
              template?.customText?.footer || `Issued: ${new Date().toLocaleDateString()}`
            ),
            React.createElement(Text, { style: styles.footerText },
              school.phone || school.email || ''
            )
          )
        )
      )
    )
  );
};

module.exports.DEFAULT_STUDENT_FIELDS = DEFAULT_STUDENT_FIELDS;

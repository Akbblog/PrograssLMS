const React = require('react');
const { Document, Page, View, Text, Image, StyleSheet } = require('@react-pdf/renderer');

// Default fields for teacher/staff cards
const DEFAULT_STAFF_FIELDS = [
  { fieldId: 'name', label: 'Name', show: true, section: 'left', order: 0, fontSize: 14, bold: true, fontColor: '#000000', alignment: 'left' },
  { fieldId: 'teacherId', label: 'ID', show: true, section: 'left', order: 1, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'role', label: 'Designation', show: true, section: 'left', order: 2, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'subject', label: 'Subject', show: true, section: 'left', order: 3, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'email', label: 'Email', show: true, section: 'left', order: 4, fontSize: 9, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'phone', label: 'Phone', show: false, section: 'left', order: 5, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'dateEmployed', label: 'Joined', show: true, section: 'left', order: 6, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'bloodGroup', label: 'Blood Group', show: false, section: 'left', order: 7, fontSize: 10, bold: false, fontColor: '#333333', alignment: 'left' },
  { fieldId: 'address', label: 'Address', show: false, section: 'left', order: 8, fontSize: 9, bold: false, fontColor: '#555555', alignment: 'left' },
];

function getFieldValue(staff, fieldId) {
  switch (fieldId) {
    case 'name': return staff.name || 'Staff Name';
    case 'teacherId': return staff.teacherId || staff.employeeId || staff.id || staff._id || 'N/A';
    case 'role': return staff.role || staff.designation || 'Staff';
    case 'subject': {
      if (!staff.subject) return '';
      return typeof staff.subject === 'object' ? staff.subject.name : staff.subject;
    }
    case 'email': return staff.email || '';
    case 'phone': return staff.phone || '';
    case 'dateEmployed': return staff.dateEmployed ? new Date(staff.dateEmployed).toLocaleDateString() : (staff.joiningDate ? new Date(staff.joiningDate).toLocaleDateString() : '');
    case 'bloodGroup': return staff.bloodGroup || '';
    case 'address': {
      const addr = staff.address || {};
      if (typeof addr === 'string') return addr;
      return [addr.street, addr.city, addr.state].filter(Boolean).join(', ') || '';
    }
    default: return staff[fieldId] || '';
  }
}

module.exports = function StaffCardTemplate({
  staff = {},
  qrDataUrl = null,
  school = {},
  template = null,
  employmentInfo = null,
}) {
  const styling = template?.styling || {};
  const layout = template?.layout || {};
  const fields = (template?.fields || DEFAULT_STAFF_FIELDS)
    .filter(f => f.show !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const primaryColor = styling.primaryColor || '#1E40AF';
  const secondaryColor = styling.secondaryColor || '#10B981';
  const bgColor = styling.backgroundColor || '#FFFFFF';
  const borderRadius = styling.borderRadius || 8;
  const borderColor = styling.borderColor || '#E5E7EB';
  const borderWidth = styling.borderWidth || 1;
  const showQR = layout.showQRCode !== false;
  const showPhoto = layout.showPhoto !== false;
  const showLogo = layout.showSchoolLogo !== false;

  const avatarSrc = staff.avatar || staff.photoUrl || null;

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
    headerText: { flex: 1 },
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
    fieldLabel: { fontSize: 8, color: '#6b7280', minWidth: 55 },
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
    staffBadge: {
      backgroundColor: secondaryColor,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginBottom: 6,
      alignSelf: 'flex-start',
    },
    staffBadgeText: { fontSize: 8, color: '#FFFFFF', fontWeight: 'bold' },
  });

  const nameField = fields.find(f => f.fieldId === 'name');
  const otherFields = fields.filter(f => f.fieldId !== 'name');

  return (
    React.createElement(Document, null,
      React.createElement(Page, { size: [288, 432], style: styles.page },
        React.createElement(View, { style: styles.card },
          // Header
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
          React.createElement(View, { style: styles.accentBar }),
          // Body
          React.createElement(View, { style: styles.body },
            React.createElement(View, { style: styles.leftCol },
              // Staff badge
              React.createElement(View, { style: styles.staffBadge },
                React.createElement(Text, { style: styles.staffBadgeText }, 'STAFF')
              ),
              // Name
              nameField
                ? React.createElement(Text, {
                    style: {
                      fontSize: nameField.fontSize || 14,
                      fontWeight: nameField.bold !== false ? 'bold' : 'normal',
                      color: nameField.fontColor || '#111827',
                      marginBottom: 6,
                    }
                  }, getFieldValue(staff, 'name'))
                : React.createElement(Text, { style: { fontSize: 14, fontWeight: 'bold', marginBottom: 6 } }, staff.name || 'Staff Name'),
              // Other fields
              ...otherFields.map((field, idx) => {
                const val = getFieldValue(staff, field.fieldId);
                if (!val) return null;
                return React.createElement(View, { key: `f-${idx}`, style: styles.fieldRow },
                  React.createElement(Text, { style: styles.fieldLabel }, `${field.label}:`),
                  React.createElement(Text, {
                    style: {
                      fontSize: field.fontSize || 10,
                      fontWeight: field.bold ? 'bold' : 'normal',
                      color: field.fontColor || '#111827',
                    }
                  }, String(val))
                );
              }).filter(Boolean),
              // Employment info
              employmentInfo && employmentInfo.joiningDate
                ? React.createElement(View, { style: styles.fieldRow },
                    React.createElement(Text, { style: styles.fieldLabel }, 'Joined:'),
                    React.createElement(Text, { style: { fontSize: 10, color: '#111827' } },
                      new Date(employmentInfo.joiningDate).toLocaleDateString()
                    )
                  )
                : null,
            ),
            // Right column
            React.createElement(View, { style: styles.rightCol },
              showPhoto
                ? React.createElement(View, { style: styles.photoContainer },
                    avatarSrc
                      ? React.createElement(Image, { src: avatarSrc, style: styles.photo })
                      : React.createElement(Text, { style: styles.photoFallback },
                          (staff.name || 'NA').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
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

module.exports.DEFAULT_STAFF_FIELDS = DEFAULT_STAFF_FIELDS;

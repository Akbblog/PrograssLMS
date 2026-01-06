const React = require('react');
const { Document, Page, View, Text, Image, StyleSheet } = require('@react-pdf/renderer');

const styles = StyleSheet.create({
  page: { padding: 12, fontSize: 10, fontFamily: 'Helvetica' },
  card: { width: '100%', height: 180, borderWidth: 1, borderColor: '#000', padding: 8, display: 'flex', flexDirection: 'row' },
  left: { width: '65%', paddingRight: 8 },
  right: { width: '35%', alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  small: { fontSize: 10, marginBottom: 2 },
  photo: { width: 80, height: 100, objectFit: 'cover', marginBottom: 6 },
  qr: { width: 90, height: 90 }
});

module.exports = function StudentCardTemplate({ student = {}, qrDataUrl = null, school = {} }) {
  return (
    React.createElement(Document, null,
      React.createElement(Page, { size: [288, 432], style: styles.page }, // small ID card size
        React.createElement(View, { style: styles.card },
          React.createElement(View, { style: styles.left },
            React.createElement(Text, { style: styles.name }, student.name || 'Student Name'),
            React.createElement(Text, { style: styles.small }, `ID: ${student.id || student._id || 'N/A'}`),
            React.createElement(Text, { style: styles.small }, `Class: ${student.currentClassLevel || (student.currentClassLevels && student.currentClassLevels[0]) || student.class || 'N/A'}`),
            React.createElement(Text, { style: styles.small }, `DOB: ${student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}`),
            React.createElement(Text, { style: styles.small }, school.name || '')
          ),
          React.createElement(View, { style: styles.right },
            student.photoUrl ? React.createElement(Image, { src: student.photoUrl, style: styles.photo }) : React.createElement(View, { style: { width: 80, height: 100, backgroundColor: '#eee', marginBottom: 6 } }),
            qrDataUrl ? React.createElement(Image, { src: qrDataUrl, style: styles.qr }) : React.createElement(View, { style: { width: 90, height: 90, backgroundColor: '#ddd' } })
          )
        )
      )
    )
  );
};

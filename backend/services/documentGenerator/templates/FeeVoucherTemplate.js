const React = require('react');
const { Document, Page, View, Text, StyleSheet } = require('@react-pdf/renderer');

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11, fontFamily: 'Helvetica' },
  header: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold' },
  section: { marginTop: 6 },
  tableRow: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }
});

module.exports = function FeeVoucherTemplate({ student = {}, fee = {}, school = {} }) {
  return (
    React.createElement(Document, null,
      React.createElement(Page, { size: "A4", style: styles.page },
        React.createElement(View, { style: styles.header },
          React.createElement(View, null,
            React.createElement(Text, { style: styles.title }, school.name || 'School'),
            React.createElement(Text, null, school.address || '')
          ),
          React.createElement(View, null,
            React.createElement(Text, null, `Date: ${new Date().toLocaleDateString()}`)
          )
        ),
        React.createElement(View, null,
          React.createElement(Text, { style: { fontSize: 14, fontWeight: 'bold' } }, 'Fee Voucher')
        ),
        React.createElement(View, { style: styles.section },
          React.createElement(View, { style: styles.tableRow },
            React.createElement(Text, null, `Student: ${student.name || 'N/A'}`),
            React.createElement(Text, null, `Class: ${student.currentClassLevels?.[0]?.name || student.class || 'N/A'}`)
          ),
          React.createElement(View, { style: styles.tableRow },
            React.createElement(Text, null, `Voucher ID: ${fee.voucherId || 'FV-' + (fee._id || '0000')}`),
            React.createElement(Text, null, `Due: ${fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : 'N/A'}`)
          ),
          React.createElement(View, { style: { marginTop: 10 } },
            React.createElement(View, { style: styles.tableRow },
              React.createElement(Text, null, 'Description'),
              React.createElement(Text, null, 'Amount')
            ),
            React.createElement(View, { style: styles.tableRow },
              React.createElement(Text, null, fee.description || 'Tuition Fee'),
              React.createElement(Text, null, `$${(fee.amount || 0).toFixed(2)}`)
            )
          )
        ),
        React.createElement(View, { style: { marginTop: 18 } },
          React.createElement(Text, null, 'Please pay by the due date to avoid penalties.')
        )
      )
    )
  );
};
